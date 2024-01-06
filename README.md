# i18n generator

Projeto criado com o intuito de gerar arquivos de tradução usando um outro arquivo ( JSON ) base.

## Requisitos
* Credenciais da AWS

## Como utilizar

* Criar um .json base dentro da pasta ``src/languages``. ex: ``en.json``
* Definir ``outputLanguages e inputLanguage`` dentro de ``src/utils/constants.js``.

Lembrando que ``inputLanguage`` tem que ser o mesmo nome do json, então se o json é en.json, inputLanguage="en"

## Variaveis de ambiente

Para rodar este projeto, voce vai precisar adicionar as seguinets variaveis de ambiente no seu arquivo .env

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`


## Authors

- [@adriano-rodrigues99](https://www.github.com/adriano-rodrigues99)
