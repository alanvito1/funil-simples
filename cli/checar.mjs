/**
 * Confere uma página antes de ela ir para o ar.
 *
 * Tudo aqui é leitura de texto: nenhuma dependência, nenhuma rede, nenhum
 * arquivo seu sai da sua máquina. Dá para ler o código inteiro em dez minutos,
 * que é o ponto.
 *
 * As checagens não são opinião. Cada uma existe porque a falta dela quebra
 * alguma coisa concreta, e o motivo vai escrito junto do resultado.
 */

const OK = "ok";
const AVISO = "aviso";
const ERRO = "erro";

/** Procura a primeira ocorrência de uma tag e devolve o atributo pedido. */
function atributo(html, seletor, atrib) {
  const re = new RegExp(`<${seletor}[^>]*\\s${atrib}=["']([^"']*)["'][^>]*>`, "i");
  return re.exec(html)?.[1] ?? null;
}

function metaConteudo(html, nome, chave = "name") {
  const re = new RegExp(`<meta[^>]*\\s${chave}=["']${nome}["'][^>]*>`, "i");
  const tag = re.exec(html)?.[0];
  return tag ? (/\scontent=["']([^"']*)["']/i.exec(tag)?.[1] ?? null) : null;
}

export function checar(html) {
  const achados = [];
  const diz = (nivel, o_que, porque) => achados.push({ nivel, o_que, porque });

  // Uma página marcada como noindex não vai aparecer na busca, e por isso não
  // precisa de canonical nem de descrição: cobrar isso dela é mandar a pessoa
  // consertar o que não está quebrado. Página de obrigado é o caso típico.
  const foraDoIndice = /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);

  // --- o básico que o buscador lê -----------------------------------------
  const titulo = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim();
  if (!titulo) {
    diz(ERRO, "sem <title>", "é o texto azul do resultado de busca e o nome da aba");
  } else if (titulo.length > 65) {
    diz(AVISO, `título com ${titulo.length} caracteres`, "acima de ~60 o Google costuma cortar");
  } else {
    diz(OK, `título: ${titulo}`);
  }

  const desc = metaConteudo(html, "description");
  if (!desc && !foraDoIndice) {
    diz(ERRO, "sem meta description", "sem ela o buscador inventa o resumo a partir do texto");
  } else if (desc && desc.length > 160) {
    diz(AVISO, `descrição com ${desc.length} caracteres`, "acima de ~155 costuma ser cortada");
  } else {
    diz(OK, "tem meta description");
  }

  const canonical = atributo(html, "link", "href");
  if (!/<link[^>]*rel=["']canonical["']/i.test(html)) {
    if (foraDoIndice) {
      diz(OK, "fora do índice de busca, então não precisa de canonical");
    } else {
      diz(
        ERRO,
        "sem <link rel=canonical>",
        "sem ela, a mesma página com ?utm_source vira outra página aos olhos do buscador",
      );
    }
  } else if (/seudominio|exemplo\.com/i.test(canonical ?? "")) {
    diz(ERRO, "canonical ainda com o domínio de exemplo", "troque pelo seu domínio de verdade");
  } else {
    diz(OK, "tem canonical");
  }

  if (!/<html[^>]*\slang=/i.test(html)) {
    diz(AVISO, "sem lang no <html>", 'pt-BR ajuda leitor de tela e tradução automática');
  }
  if (!/<meta[^>]*name=["']viewport["']/i.test(html)) {
    diz(ERRO, "sem viewport", "a página abre minúscula no celular, que é onde a maioria lê");
  }

  // --- privacidade e LGPD --------------------------------------------------
  const temFormulario = /<form\b/i.test(html);
  if (temFormulario) {
    const temAceite = /type=["']checkbox["']/i.test(html);
    if (!temAceite) {
      diz(
        ERRO,
        "formulário sem caixa de aceite",
        "o consentimento é a base legal para você mandar e-mail depois",
      );
    } else if (/checkbox["'][^>]*\schecked/i.test(html)) {
      diz(ERRO, "aceite já vem marcado", "consentimento pré-marcado não é consentimento");
    } else {
      diz(OK, "formulário pede aceite");
    }

    if (!/privacidade|pol[ií]tica de dados/i.test(html)) {
      diz(AVISO, "sem link de privacidade perto do formulário", "a LGPD espera que você diga o que faz com o dado");
    }

    const action = atributo(html, "form", "action");
    if (!action || /COLE-AQUI|^#?$/.test(action)) {
      diz(ERRO, "formulário sem destino", "o action ainda é o do modelo: ninguém vai receber nada");
    }
    if (!/<form[^>]*method=["']post["']/i.test(html)) {
      diz(AVISO, "formulário sem method=post", "com GET o e-mail da pessoa vai parar na URL e no histórico");
    }
  }

  // --- o que a página carrega de fora --------------------------------------
  // Carregar é diferente de linkar. Um <a href> para outro site não faz o
  // navegador pedir nada a ninguém; um <img src>, uma fonte ou uma folha de
  // estilo fazem. E o canonical, que é um <link>, também não carrega nada —
  // acusar ele aqui seria mandar você tirar a tag mais importante da página.
  const CARREGA = /\brel=["'](?:stylesheet|preload|prefetch|preconnect|dns-prefetch|modulepreload)["']/i;
  const externos = [];

  for (const m of html.matchAll(/\ssrc=["'](https?:\/\/[^"']+)["']/gi)) {
    externos.push(m[1]);
  }
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const href = /\shref=["'](https?:\/\/[^"']+)["']/i.exec(tag)?.[1];
    if (href && CARREGA.test(tag)) externos.push(href);
  }
  if (externos.length > 0) {
    diz(
      AVISO,
      `carrega ${externos.length} recurso(s) de fora: ${[...new Set(externos.map((u) => new URL(u).host))].join(", ")}`,
      "cada um é uma requisição a mais, e os que usam cookie fazem você precisar de aviso de cookie",
    );
  } else {
    diz(OK, "não carrega nada de terceiro");
  }

  const scripts = (html.match(/<script\b(?![^>]*application\/ld\+json)/gi) ?? []).length;
  if (scripts > 0) {
    diz(AVISO, `${scripts} <script> na página`, "uma página de captura funciona inteira sem JavaScript");
  }

  // --- dado estruturado ----------------------------------------------------
  if (foraDoIndice) {
    // Descrever para um buscador uma página que você acabou de mandar ele
    // ignorar não ajuda ninguém.
  } else if (!/application\/ld\+json/i.test(html)) {
    diz(
      AVISO,
      "sem dado estruturado (JSON-LD)",
      "é como buscador e assistente de IA entendem quem escreveu e sobre o quê",
    );
  } else {
    for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
      try {
        JSON.parse(m[1]);
      } catch {
        diz(ERRO, "JSON-LD inválido", "um bloco quebrado é ignorado inteiro");
      }
    }
  }

  return achados;
}

export function formatar(achados) {
  const simbolo = { ok: "  ok ", aviso: "AVISO", erro: " ERRO" };
  const linhas = achados.map(
    (a) => `${simbolo[a.nivel]}  ${a.o_que}${a.porque ? `\n        ${a.porque}` : ""}`,
  );
  const erros = achados.filter((a) => a.nivel === ERRO).length;
  const avisos = achados.filter((a) => a.nivel === AVISO).length;
  linhas.push("");
  linhas.push(
    erros === 0 && avisos === 0
      ? "Nada a consertar."
      : `${erros} erro(s), ${avisos} aviso(s). Erro quebra alguma coisa; aviso é melhoria.`,
  );
  return linhas.join("\n");
}

export { ERRO, AVISO, OK };
