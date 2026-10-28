# Funil Simples

Ferramentas abertas para quem quer vender pela internet no Brasil e trava na
parte técnica: página que captura e-mail, e-mail automático, e as ferramentas
que fazem isso funcionar sem custo no começo.

Tudo aqui é **copiar, trocar o texto e publicar**. Sem build, sem instalação,
sem dependência.

---

## O que tem aqui

### `modelos/` — páginas prontas em HTML puro

Uma pasta por modelo. Abre o `index.html`, troca o texto, publica em qualquer
lugar que sirva arquivo estático.

| Modelo | Para quê |
|---|---|
| [`captura-simples/`](modelos/captura-simples/) | Promessa, um campo, um botão. O essencial e nada mais |
| [`obrigado/`](modelos/obrigado/) | A página depois do cadastro, que quase todo mundo esquece |

Nenhum deles carrega fonte, script ou imagem de fora. Isso não é purismo: é o
que faz a página abrir rápido em celular barato com internet ruim, e é o que
evita você precisar de aviso de cookie.

### `cli/` — conferir o que você publicou

```sh
npx funil-simples checar minha-pagina.html
```

Lê um arquivo HTML e diz o que falta: título, descrição, canonical, dado
estruturado, aviso de LGPD, recurso carregado de terceiro. Sem instalar nada,
sem mandar seu arquivo para lugar nenhum — roda na sua máquina.

Também gera um modelo novo:

```sh
npx funil-simples novo minha-pagina
```

### `guias/` — o que foi verificado, com fonte e data

Texto em Markdown, com a fonte e a data de cada número. Onde as fontes
divergem, o guia diz que divergem em vez de escolher a mais bonita.

### `checklists/` — antes de publicar

[LGPD](checklists/lgpd.md) · [Página que converte](checklists/pagina-que-converte.md)

---

## Quem mantém

[Alan Victor](https://github.com/alanvito1). Escrevo sobre isso em
[funilsimples.com](https://funilsimples.com), onde explico cada passo com mais
calma do que cabe num README.

**Divulgação:** o site tem links de afiliado e eu recebo comissão se você
assinar alguma ferramenta por eles. **Este repositório não tem nenhum.** Links
aqui apontam para documentação oficial ou para o site, que avisa quando um link
é de afiliado.

## Relação com os outros projetos

Pra não confundir, já que estão todos na mesma conta do GitHub:

| | O que é | Onde |
|---|---|---|
| **funil-simples** | este repositório: ferramentas abertas, MIT, sem link de afiliado | público |
| **funilsimples.com** | o site com os artigos. Tem link de afiliado, e avisa | público |
| **rede-afiliados-rec** | o código que roda o site e a medição | **privado** |
| **ORSTAC** | **outro projeto, outro assunto**: robôs de trade. Não tem relação nenhuma com funil de vendas | público |

## Licença

[MIT](LICENSE). Use, copie, venda o que fizer com isso. Não preciso de crédito,
mas agradeço a estrela se ajudou.
