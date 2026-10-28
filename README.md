# Funil Simples

**Monte e venda um produto digital sem pagar ferramenta.** Página que captura
e-mail, e-mail automático que dispara sozinho, área de aluno, checkout — tudo
no plano gratuito, até você estar vendendo.

### ▶ [Criar a conta gratuita na Systeme.io](https://funilsimples.com/go/systeme?s=github&p=%2Freadme)

> **Link de afiliado**, e eu recebo comissão se você assinar um plano pago
> depois. Você paga o mesmo preço, e o plano gratuito continua gratuito. Não
> pede cartão.

Aqui ficam as ferramentas abertas: modelos em HTML puro, checklists e um
programa que confere a sua página. **Copiar, trocar o texto e publicar.** Sem
build, sem instalação, sem dependência.

| | |
|---|---|
| 📄 **Artigos, com fonte e data** | [funilsimples.com](https://funilsimples.com) |
| 💬 **Dúvida ou ideia** | [Discussões](https://github.com/alanvito1/funil-simples/discussions) |
| 📣 **Aviso de artigo novo** | [t.me/funilsimples](https://t.me/funilsimples) |

---

## Por que uma ferramenta só, e não cinco

A conta que trava quem está começando não é o preço de uma assinatura: é o de
cinco. Uma plataforma tudo-em-um resolve isso porque substitui a pilha inteira.

| O que precisa funcionar | O que normalmente se assina separado |
|---|---|
| Funil, página de captura e página de venda | ClickFunnels, Leadpages |
| E-mail marketing, automação e SMS | MailerLite, Mailchimp |
| **Curso online com área de alunos** | Hotmart, Teachable, Kajabi |
| **Checkout** (Stripe, PayPal, Mercado Pago) | gateway + plugin |
| **Programa de afiliados próprio** | plataforma de afiliados |
| Blog, site, comunidade, webinar, agenda | WordPress + plugins |

A plataforma que eu uso para isso é a **Systeme.io**, e o plano gratuito dela
tem **2.000 contatos e e-mails ilimitados** — número lido na página oficial de
recursos em 28/10/2026.

**O que eu não vou afirmar:** a página de recursos diz "primeiro funil sem
custo" e fontes de terceiros dizem "3 funis". Não confirmei qual está certo, e
por isso o número não aparece aqui. A tabela de preços deles não é legível fora
do navegador, então os outros limites do plano gratuito eu ainda não verifiquei.

Comparativo honesto, com o que ela **não** faz:
[funilsimples.com/ferramenta-gratuita](https://funilsimples.com/ferramenta-gratuita)

> **Como eu me pago, dito antes de você perguntar:** com comissão de afiliado
> da Systeme.io. O link no começo deste arquivo é de afiliado, e cada link de
> afiliado aqui e no site vem com esse aviso do lado — nunca escondido no meio
> do texto. Você paga o mesmo preço com ele ou sem ele.
>
> O que isso muda na prática, e que eu prefiro dizer antes: eu tenho incentivo
> para você assinar. Por isso o comparativo diz também onde a ferramenta
> **perde**, e por isso os modelos e o programa deste repositório funcionam sem
> ela — são HTML puro, servem em qualquer lugar.

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

## Relação com os outros projetos

Pra não confundir, já que estão todos na mesma conta do GitHub:

| | O que é | Onde |
|---|---|---|
| **funil-simples** | este repositório: ferramentas abertas, MIT. Tem o link de afiliado da Systeme.io, com aviso | público |
| **funilsimples.com** | o site com os artigos. Tem link de afiliado, e avisa | público |
| **ORSTAC** | **outro projeto, outro assunto**: robôs de trade. Não tem relação nenhuma com funil de vendas | público |

## Licença

[MIT](LICENSE). Use, copie, venda o que fizer com isso. Não preciso de crédito,
mas agradeço a estrela se ajudou.

---

## Você também pode ser afiliado

O cadastro de afiliado da Systeme.io é gratuito e não exige assinar plano. A
comissão é **60% vitalícia**, segundo a página oficial do programa, lida em
28/10/2026.

**[Cadastro de afiliado](https://funilsimples.com/go/systeme-afiliado?s=github&p=%2Freadme)**

> Também é link de afiliado meu. **Dito com clareza:** a página oficial do
> programa não menciona comissão de segundo nível, então eu *não* ganho por
> você virar afiliado — só se você assinar um plano pago. Auto-indicação é
> proibida por eles: não dá para usar o próprio link para comprar.

---

## Página com os níveis de escala

**[alanvito1.github.io/funil-simples](https://alanvito1.github.io/funil-simples/)**
— os seis níveis, do primeiro e-mail capturado ao programa de afiliados
próprio, e os modelos abrindo ao vivo.
