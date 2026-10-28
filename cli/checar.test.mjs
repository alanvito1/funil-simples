import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { readFile } from "node:fs/promises";
import { checar, ERRO, AVISO } from "./checar.mjs";

const tem = (achados, re) => achados.some((a) => re.test(a.o_que));
const erros = (achados) => achados.filter((a) => a.nivel === ERRO);
const avisos = (achados) => achados.filter((a) => a.nivel === AVISO);

/** Uma página sem nenhum problema, para cada teste quebrar uma coisa só. */
const BOA = `<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Receba o checklist de 7 passos</title>
<meta name="description" content="Um checklist de uma pagina com os passos que eu sigo.">
<link rel="canonical" href="https://meusite.com.br/">
<script type="application/ld+json">{"@type":"WebSite"}</script>
</head><body>
<form method="post" action="https://envio.com/f/1">
  <input type="email" name="email" required>
  <label><input type="checkbox" name="aceite" required> aceito. <a href="/privacidade.html">privacidade</a></label>
  <button>Quero</button>
</form>
</body></html>`;

describe("checar", () => {
  it("pagina completa passa limpa", () => {
    const r = checar(BOA);
    assert.deepEqual(erros(r), [], JSON.stringify(erros(r)));
    assert.deepEqual(avisos(r), [], JSON.stringify(avisos(r)));
  });

  it("canonical nao e recurso carregado de fora", () => {
    // Link nao faz o navegador pedir nada. Acusar o canonical seria mandar a
    // pessoa tirar a tag mais importante da pagina.
    assert.ok(!tem(checar(BOA), /carrega .* de fora/));
  });

  it("acusa o que de fato e carregado de fora", () => {
    const comFonte = BOA.replace(
      "</head>",
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=X"></head>',
    );
    assert.ok(tem(checar(comFonte), /carrega 1 recurso/));
    const comImagem = BOA.replace("<body>", '<body><img src="https://cdn.terceiro.com/a.png">');
    assert.ok(tem(checar(comImagem), /carrega 1 recurso/));
  });

  it("link para outro site e permitido", () => {
    const comLink = BOA.replace("<body>", '<body><a href="https://github.com/alanvito1">github</a>');
    assert.ok(!tem(checar(comLink), /carrega .* de fora/));
  });

  it("reclama de titulo, descricao e canonical ausentes", () => {
    assert.ok(tem(checar(BOA.replace(/<title>[\s\S]*?<\/title>/, "")), /sem <title>/));
    assert.ok(tem(checar(BOA.replace(/<meta name="description"[^>]*>/, "")), /sem meta description/));
    assert.ok(tem(checar(BOA.replace(/<link rel="canonical"[^>]*>/, "")), /sem <link rel=canonical>/));
  });

  it("pega o dominio de exemplo que ficou no canonical", () => {
    const esquecido = BOA.replace("https://meusite.com.br/", "https://seudominio.com.br/");
    assert.ok(tem(checar(esquecido), /dom[ií]nio de exemplo/));
  });

  it("formulario sem aceite e erro, e aceite pre-marcado tambem", () => {
    const semAceite = BOA.replace(/<label>[\s\S]*?<\/label>/, "");
    assert.ok(tem(checar(semAceite), /sem caixa de aceite/));
    const preMarcado = BOA.replace('type="checkbox" name="aceite"', 'type="checkbox" checked name="aceite"');
    assert.ok(tem(checar(preMarcado), /j[áa] vem marcado/));
  });

  it("formulario que ainda aponta para o modelo e erro", () => {
    const semDestino = BOA.replace("https://envio.com/f/1", "COLE-AQUI-A-URL-DO-SEU-FORMULARIO");
    assert.ok(tem(checar(semDestino), /sem destino/));
  });

  it("formulario com GET avisa: o e-mail vai parar na URL", () => {
    const comGet = BOA.replace('method="post"', 'method="get"');
    assert.ok(tem(checar(comGet), /sem method=post/));
  });

  it("JSON-LD quebrado e erro", () => {
    const quebrado = BOA.replace('{"@type":"WebSite"}', '{"@type": }');
    assert.ok(tem(checar(quebrado), /JSON-LD inv[áa]lido/));
  });

  it("pagina sem formulario nao e cobrada por aceite", () => {
    const semForm = BOA.replace(/<form[\s\S]*?<\/form>/, "<p>texto</p>");
    assert.ok(!tem(checar(semForm), /aceite/));
  });
});

describe("o nosso proprio modelo", () => {
  it("avisa exatamente o que falta trocar, e nada alem disso", async () => {
    // O modelo reprova de proposito: os erros sao os marcadores que a pessoa
    // precisa trocar. Se aparecer erro que nao seja esse, o modelo esta errado.
    const html = await readFile(
      new URL("../modelos/captura-simples/index.html", import.meta.url),
      "utf8",
    );
    const r = checar(html);
    for (const e of erros(r)) {
      assert.match(e.o_que, /dom[ií]nio de exemplo|sem destino/, `erro inesperado: ${e.o_que}`);
    }
    assert.ok(!tem(r, /carrega .* de fora/), "o modelo nao pode carregar nada de terceiro");
    assert.ok(!tem(r, /<script>/), "o modelo nao tem script");
  });
});

describe("pagina fora do indice", () => {
  const OBRIGADO = `<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pronto</title><meta name="robots" content="noindex,nofollow">
</head><body><p>Confira seu e-mail.</p></body></html>`;

  it("nao e cobrada por canonical, descricao nem dado estruturado", () => {
    // Pedir canonical de uma pagina que voce acabou de mandar o buscador
    // ignorar e mandar a pessoa consertar o que nao esta quebrado.
    const r = checar(OBRIGADO);
    assert.deepEqual(erros(r), [], JSON.stringify(erros(r)));
    assert.deepEqual(avisos(r), [], JSON.stringify(avisos(r)));
  });

  it("o nosso modelo de obrigado passa limpo", async () => {
    const html = await readFile(new URL("../modelos/obrigado/index.html", import.meta.url), "utf8");
    const r = checar(html);
    assert.deepEqual(erros(r), [], JSON.stringify(erros(r)));
  });
});
