

# pgats-books-api

API REST + GraphQL para catálogo de livros com autenticação JWT.


## Como subir o servidor

1. Instale as dependências:
  ```bash
  npm install
  ```
2. Configure o arquivo `.env` (veja `.env.example`):
  ```
  PORT=4010
  JWT_SECRET=supersecret
  ```
3. Inicie o servidor:
  ```bash
  npm start
  ```
  O servidor Express irá subir na porta definida (padrão: 4010).

## APIs disponíveis

### REST

| Método | Caminho           | Descrição                       |
|--------|-------------------|---------------------------------|
| POST   | /auth/login       | Autenticação e obtenção do token|
| GET    | /books            | Lista todos os livros           |
| POST   | /books            | Cria um novo livro              |
| GET    | /books/{id}       | Consulta detalhes de um livro   |
| PUT    | /books/{id}       | Atualiza um livro               |
| DELETE | /books/{id}       | Remove um livro                 |
| GET    | /users/me         | Dados do usuário autenticado    |

### Swagger

- [`/docs`](http://localhost:4010/docs) — Documentação interativa

### GraphQL

- [`/graphql`](http://localhost:4010/graphql)

**Queries:**
  - `me`: Dados do usuário autenticado
  - `books`: Lista todos os livros
  - `book(id)`: Consulta detalhes de um livro

**Mutations:**
  - `login(login, senha)`: Autenticação e obtenção do token
  - `createBook(titulo, autor, ano)`: Cria um novo livro
  - `updateBook(id, titulo, autor, ano)`: Atualiza um livro
  - `deleteBook(id)`: Remove um livro
## Detalhes técnicos

- Node.js + Express
- Apollo Server Express para GraphQL
- Autenticação JWT
- Documentação Swagger
- Testes automatizados (Mocha, Chai, Supertest, Sinon)
- Relatórios Allure
- CI/CD com GitHub Actions
- Estrutura em camadas: controller, service, model, middleware, routes, graphql, docs
- Dados de usuários e livros em memória (para testes e demonstração)


## Autenticação
Todas as rotas privadas exigem header:
```
Authorization: Bearer <token>
```
Obtenha o token em `POST /auth/login`.


### Usuários de teste

| login  | senha   |
|--------|---------|
| admin  | admin   |
| user1  | senha1  |
| user2  | senha2  |

### Exemplo de login
```
POST /auth/login
{
  "login": "admin",
  "senha": "admin"
}
```
Resposta:
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Exemplos de uso REST

**Criar livro:**
```
POST /books
Authorization: Bearer <token>
{
  "titulo": "Livro 1",
  "autor": "Autor 1",
  "ano": 2020
}
```

**Listar livros:**
```
GET /books
Authorization: Bearer <token>
```

**Detalhar livro:**
```
GET /books/1
Authorization: Bearer <token>
```

**Atualizar livro:**
```
PUT /books/1
Authorization: Bearer <token>
{
  "titulo": "Novo Titulo"
}
```

**Remover livro:**
```
DELETE /books/1
Authorization: Bearer <token>
```

**Usuário autenticado:**
```
GET /users/me
Authorization: Bearer <token>
```

## Exemplos de uso GraphQL

Endpoint: `/graphql`

### Queries
```graphql
query {
  me { login }
  books { id titulo autor ano }
  book(id: 1) { id titulo autor ano }
}
```

### Mutations
```graphql
mutation {
  login(login: "admin", senha: "admin") { token }
  createBook(titulo: "Livro", autor: "Autor", ano: 2020) { id titulo }
  updateBook(id: 1, titulo: "Novo Titulo") { id titulo }
  deleteBook(id: 1)
}
```

## Testes automatizados

### Testes Funcionais
- Mocha, Chai, Supertest, Sinon
- Testes de controller, REST, GraphQL e external (HTTP real)
- Use `npm run test:all` para rodar todos os testes com o servidor ativo

### Testes de Performance (K6)
Teste de performance baseado na aula: login + operação autenticada.

```bash
# Comando básico
k6 run test/k6/performance-test.js

# Com Web Dashboard (interface gráfica em tempo real)
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PERIOD=2s k6 run test/k6/performance-test.js

# Com Web Dashboard + relatório HTML exportado
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html K6_WEB_DASHBOARD_PERIOD=2s k6 run test/k6/performance-test.js

# Ou via npm script
npm run k6:test

# Instalar K6: https://k6.io/docs/getting-started/installation/
```

**💡 Web Dashboard:** Use `K6_WEB_DASHBOARD=true` para visualizar métricas em tempo real no navegador (http://localhost:5665)

**📁 Arquivo:** [`test/k6/performance-test.js`](test/k6/performance-test.js)  
**Status:** ✅ Teste validado e funcionando

## Relatório visual dos testes


Relatório Allure: [Allure Report - GitHub Pages](https://renatacpf.github.io/pgats-books-api/)

**Importante:** Para evitar duplicidade de cenários no relatório Allure, limpe a pasta `allure-results` antes de rodar os testes:

```bash
rm -rf allure-results
npm test
npm run allure:generate
npm run allure:open
```

Se o relatório mostrar cenários duplicados, certifique-se de que a pasta `allure-results` foi limpa antes de rodar os testes.

## Scripts
```bash
# Servidor
npm start             # Inicia API
npm run dev           # Inicia com nodemon

# Testes Funcionais
npm test              # Executa todos os testes com Allure
npm run test:controller # Testes isolados de controller
npm run test:rest     # Testes REST
npm run test:graphql  # Testes GraphQL
npm run test:external # Testes HTTP reais (com servidor)
npm run test:all      # Executa todos os testes (controller + external) com servidor ativo
npm run coverage      # Cobertura de testes

# Testes de Performance (K6)
npm run k6:test          # Teste de performance K6 (10 usuários, 20s)
npm run k6:dashboard     # Teste com Web Dashboard (interface gráfica)
npm run performance:test # Alias para k6:test

# Relatórios
npm run allure:generate # Gera relatório Allure
npm run allure:open   # Abre relatório Allure local
```

## Variáveis de ambiente
Veja `.env.example`:
```
PORT=4010
JWT_SECRET=supersecret
```

## Pipeline CI
Executa testes, gera e publica Allure Report no GitHub Pages.

## Estrutura
```
app.js
server.js
package.json
.env.example
README.md
src/
  controller/
  service/
  model/
  middleware/
  routes/
  graphql/
  docs/
test/
  rest/
    controller/
    external/
  graphql/
    controller/
    external/
.github/
  workflows/
    ci.yml
.gitignore
```
