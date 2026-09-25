# Dose de ruído (NR-15, Anexo 1)

Identificador: `dose-de-ruido`. Pacote independente da interface ELUCENIA, para navegador e Node.js.

## Situação

- Revisão: **needs-review**. Revisão documental e clínica independente pendente.
- Execução: **disponível para reprodução técnica da fórmula**.
- Validação clínica independente: **não realizada**. Os testes abaixo verificam aritmética e transporte dos campos.
- Fonte importada: Panorama Médico; arquivo `app/content/ferramentas/saude-coletiva.php`.
- 7/7 casos de referência conferidos na importação. 0 casos independentes desta ferramenta.
- Dados: o exemplo funciona localmente, sem rede, armazenamento ou identificação de pacientes.

## Uso no Node.js

```js
const { calculate } = require('./calculator.js');
const example = require('./examples.json')[0];
console.log(calculate(example.input));
```

Execute `node test.cjs` (ou `npm test`) para conferir os exemplos. Abra `index.html` para usar a versão local do navegador. Não há dependências npm.

## Contrato

`calculate(input)` recebe um objeto, devolve `{id, main, label, raw, clinicalValidation}` ou `{error, code, field?}`. Consulte `tool.json` e `metadata.fields` para nomes, unidades, opções e intervalos. Números aceitam valores finitos ou strings numéricas; opções precisam corresponder às chaves documentadas. Campos obrigatórios vazios, booleanos inválidos, valores fora de intervalo e resultados não finitos são rejeitados. Somente checkbox omitido representa falso; um campo numérico ou uma opção obrigatória nunca é preenchido automaticamente.

Interpretações, ordens terapêuticas e tabelas herdadas não são retornadas pelo adaptador. Classificações e valores ainda dependem da população e das limitações da fonte.

## Fórmula / versão

Dose = C1/T1 + C2/T2 + … + Cn/Tn, em que C é o tempo total de exposição a um nível e T é a máxima exposição diária permissível a esse nível (Quadro do Anexo 1). Se a soma exceder 1 (100%), a exposição está acima do limite de tolerância.Níveis intermediários usam o tempo do nível imediatamente mais elevado do Quadro (item 4). Tempo em horas decimais: 30 min = 0,5 h; 15 min = 0,25 h.

A transcrição acima documenta o acervo de origem e pode requerer atualização. 

## Condições e limites

Soma os efeitos de vários períodos de exposição a níveis de ruído diferentes na jornada e compara com o limite de tolerância da NR-15.

Confirme população, exclusões, unidades, versão e diretriz aplicável ao país e serviço. O resultado não deve ser utilizado isoladamente para diagnóstico, alta ou prescrição. O pacote não representa certificação clínica, aprovação regulatória ou indicação para toda população. Veja a revisão completa em `tool.json`.

## Fontes originais

- [Brasil. Ministério do Trabalho e Emprego. Norma Regulamentadora nº 15 (NR-15): Atividades e Operações Insalubres, com o Anexo 3 alterado pela Portaria SEPRT nº 1.359/2019.](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-15-nr-15)
- [Fundacentro. Norma de Higiene Ocupacional NHO 01: Avaliação da exposição ocupacional ao ruído, 2001.](https://cursos-eventos.fundacentro.gov.br/biblioteca/normas-de-higiene-ocupacional/publicacao/detalhe/2012/9/nho-01-procedimento-tecnico-avaliacao-da-exposicao-ocupacional-ao-ruido)

## Exemplos e rastreabilidade

`examples.json` preserva `originalInput`, expectativa e entrada explícita do exemplo. Não foi necessário expandir opções zero nos exemplos.

## Direitos e repositório

Este pacote integra o acervo privado de desenvolvimento da ELUCENIA. A publicação externa depende de liberação expressa. A licença MIT (arquivo LICENSE) cobre o código de integração, preservando o aviso de autoria e a licença; não transfere direitos sobre instrumentos, traduções, questionários, artigos, marcas ou outros materiais de terceiros. Consulte NOTICE.md e as condições de cada titular. O acesso a este adaptador não publica nem licencia automaticamente o restante da plataforma ELUCENIA.

## Acesso ao repositório

Repositório privado da organização ELUCENIA. A abertura pública depende de liberação expressa.
