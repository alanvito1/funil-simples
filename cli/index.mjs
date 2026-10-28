#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checar, formatar, ERRO } from "./checar.mjs";

/**
 * funil-simples: dois comandos, zero dependencia, nenhuma chamada de rede.
 *
 *   npx funil-simples checar pagina.html
 *   npx funil-simples novo minha-pagina
 */

const AQUI = dirname(fileURLToPath(import.meta.url));
const [comando, alvo] = process.argv.slice(2);

const AJUDA = `
funil-simples - ferramentas para pagina de captura

  npx funil-simples checar <arquivo.html>
      Le o arquivo e diz o que falta: titulo, descricao, canonical, aceite da
      LGPD, dado estruturado, recurso carregado de terceiro.
      Nada sai da sua maquina.

  npx funil-simples novo <nome>
      Cria uma pasta com o modelo de pagina de captura para voce editar.

Mais explicacao em https://funilsimples.com
`;

if (!comando || comando === "--help" || comando === "-h" || comando === "ajuda") {
  console.log(AJUDA);
  process.exit(comando ? 0 : 1);
}

try {
  if (comando === "checar") {
    if (!alvo) throw new Error("diga qual arquivo: npx funil-simples checar pagina.html");
    const html = await readFile(resolve(alvo), "utf8");
    const achados = checar(html);
    console.log(`\n${alvo}\n`);
    console.log(formatar(achados));
    // Sai com erro para dar para usar em CI.
    if (achados.some((a) => a.nivel === ERRO)) process.exitCode = 1;
  } else if (comando === "novo") {
    if (!alvo) throw new Error("diga o nome: npx funil-simples novo minha-pagina");
    const modelo = await readFile(join(AQUI, "..", "modelos", "captura-simples", "index.html"), "utf8");
    const destino = resolve(alvo);
    await mkdir(destino, { recursive: true });
    await writeFile(join(destino, "index.html"), modelo, { flag: "wx" });
    console.log(`\nCriado: ${join(alvo, "index.html")}`);
    console.log("Troque o que esta marcado com TROQUE e publique.");
    console.log(`Depois confira:  npx funil-simples checar ${join(alvo, "index.html")}\n`);
  } else {
    console.log(AJUDA);
    process.exitCode = 1;
  }
} catch (err) {
  console.error(
    err.code === "ENOENT" ? `Nao achei o arquivo: ${alvo}`
    : err.code === "EEXIST" ? `Ja existe: ${alvo}/index.html (nao sobrescrevi)`
    : err.message,
  );
  process.exitCode = 1;
}
