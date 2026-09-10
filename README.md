# FCK3 Engenharia — protótipo v0.1

Primeiro protótipo navegável para apresentação ao Fazilari. Baseado no arquivo `FCK3 Engenharia(2).fig` e na direção visual v0.1 fornecidos por Leo.

## Abrir

O site é estático, sem instalação nem build. Sirva a pasta `dist` por HTTP:

```sh
python3 -m http.server 8000 --directory dist
```

Abra `http://localhost:8000`. Para uma hospedagem estática, use `dist` como diretório publicado. As URLs e os assets são relativos, permitindo publicação em subpastas. Não há deploy de produção configurado por este protótipo.

## Páginas

- `index.html`: entrada principal por construção ou reforma.
- `construcao.html`: três modalidades, recursos e terreno.
- `reforma.html`: residencial ou comercial, recursos próprios.
- `contato.html`: formulário pré-preenchido, editável, revisão e confirmação simulada.
- `quem-somos.html`: história conhecida e placeholders institucionais.
- `obras.html`: galeria com filtros e carregamento progressivo de seis espaços demonstrativos.
- `projeto.html?id=1`: estrutura de detalhe da obra, sem dados inventados.

## Jornada

Construção → modalidade / recursos / terreno → formulário → revisão → simulação.
Reforma → residencial / comercial → formulário → revisão → simulação.
Contato geral → escolha do serviço → formulário correspondente.

Gestão do projeto seleciona financiamento pela Caixa e esclarece que não inclui execução. Trocar o pagamento para recursos próprios ou orientação redefine a modalidade para orientação. Reforma remove campos de modalidades e terreno e considera somente recursos próprios. Todos os parâmetros de URL passam por listas de valores permitidos. Dados pessoais não são colocados na URL ou em armazenamento persistente.

O formulário exige serviço, cidade/bairro, descrição, nome e e-mail. Telefone é opcional. A revisão usa texto seguro, e editar preserva as respostas. **Nenhum e-mail é enviado.** A confirmação é explicitamente simulada; não há backend, coleta, analytics ou promessa de aprovação de financiamento.

## Direção visual

Concrete `#F2F0EA`, Sand `#DED8CC`, Structural `#28312F`, Terracotta `#A84E38`, conforme documento de referência. Manrope nos títulos e CTAs; IBM Plex Sans em textos e formulários. As fontes carregam pelo Google Fonts, com fallback local Arial/sans-serif caso a rede não esteja disponível. Os placeholders de fotografia são intencionais. O texto FCK3 no cabeçalho é provisório: o logo original não foi redesenhado.

## Verificação

```sh
node --test tests/journey.test.mjs
node --check dist/assets/app.js
```

Validados sintaxe JavaScript, regras de jornada e links/assets locais. Testes em navegador e inspeção visual não executados nesta entrega.

## Próxima reunião

Veja `docs/pendencias.md`. Remover `noindex,nofollow` e o aviso de protótipo somente ao preparar a versão pública definitiva.
