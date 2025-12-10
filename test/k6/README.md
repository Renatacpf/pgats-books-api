# Testes de Performance com K6 - Books API

Este documento descreve a implementação completa dos testes de performance utilizando K6 para a Books API, demonstrando a aplicação de 11 conceitos fundamentais de testes de carga e performance.

## Requisitos

- K6 customizado com extensão faker (k6.exe no diretório raiz do projeto)
- API Books rodando na porta 4010
- Go 1.23+ e xk6 (para rebuild do K6, se necessário)

## Estrutura de Arquivos

```
test/k6/
├── performance-test.js          # Script principal de testes
├── data/
│   └── users.test.data.json    # Dados de usuários para testes
└── helpers/
    ├── getBaseUrl.js           # Helper para URL base
    ├── login.js                # Helper para autenticação
    └── randomData.js           # Helper para geração de dados aleatórios
```

## Execução dos Testes

### Comando Recomendado

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html K6_WEB_DASHBOARD_PERIOD=2s ./k6.exe run test/k6/performance-test.js 2>error.log
```

Este comando ativa Web Dashboard em tempo real, exporta relatório HTML e redireciona erros para error.log mantendo o console limpo.

### Web Dashboard

Acesse http://localhost:5665 durante a execução para visualizar métricas em tempo real.

---

## Conceitos Implementados

### 1. Thresholds

O código abaixo está armazenado no arquivo test/k6/performance-test.js e demonstra o uso do conceito de Thresholds. Thresholds definem critérios de aceitação de performance, determinando se um teste passou ou falhou com base em métricas específicas.

```javascript
export let options = {
    thresholds: {
        http_req_duration: ['p(95)<5000'],
    }
};
```

Neste exemplo, defino que 95% das requisições HTTP devem ser completadas em menos de 5 segundos. O percentil 95 ignora os 5% mais lentos, focando na maioria das requisições. Se este threshold falhar, o teste inteiro é considerado falho.

---

### 2. Checks

O código abaixo está armazenado no arquivo test/k6/performance-test.js e demonstra o uso do conceito de Checks. Checks validam se as respostas atendem aos critérios esperados, sem interromper a execução do teste quando falham.

```javascript
check(res, { 'criar livro status 201': (r) => r.status === 201 });
check(res, { 'listar livros status 200': (r) => r.status === 200 });
```

Neste exemplo, valido se a criação de livro retorna status HTTP 201 (Created) e se a listagem retorna status 200 (OK). Cada check retorna true ou false mas não para o teste. O K6 contabiliza quantos checks passaram versus o total de checks executados.

---

### 3. Helpers

O código abaixo está armazenado no arquivo test/k6/helpers/login.js e demonstra o uso do conceito de Helpers. Helpers são funções auxiliares reutilizáveis que evitam duplicação de código.

```javascript
export function login(username, password) {
    const url = `${getBaseUrl()}/auth/login`;
    const payload = JSON.stringify({ login: username, senha: password });
    const params = { headers: { 'Content-Type': 'application/json' } };
    
    const res = http.post(url, payload, params);
    
    check(res, {
        'login status e 200': (r) => r.status === 200,
        'token retornado': (r) => r.json('token') !== undefined
    });
    
    return res.json('token');
}
```

Esta função encapsula toda a lógica de autenticação, recebe credenciais como parâmetros e retorna o token JWT. Inclui validações para garantir que o login foi bem-sucedido.

O código abaixo está armazenado no arquivo test/k6/helpers/getBaseUrl.js e demonstra o uso do conceito de Helpers para gerenciar URLs base.

```javascript
export function getBaseUrl() {
    return __ENV.BASE_URL || 'http://localhost:4010';
}
```

Esta função centraliza a configuração da URL base da API, permitindo alterar o ambiente através de variável de ambiente sem modificar o código.

O código abaixo está armazenado no arquivo test/k6/helpers/randomData.js e demonstra o uso do conceito de Helpers para geração de dados aleatórios.

```javascript
export function randomISBN() {
    const timestamp = Date.now();
    const vu = typeof __VU !== 'undefined' ? __VU : 1;
    return `978-${timestamp}-${vu}`;
}

export function randomYear() {
    const currentYear = new Date().getFullYear();
    const minYear = 1900;
    return minYear + Math.floor(Math.random() * (currentYear - minYear + 1));
}
```

Estas funções geram ISBNs únicos usando timestamp e número do VU para evitar conflitos, e geram anos aleatórios válidos entre 1900 e o ano atual.

---

### 4. Trends

O código abaixo está armazenado no arquivo test/k6/performance-test.js e demonstra o uso do conceito de Trends. Trends são métricas customizadas que coletam valores numéricos ao longo do tempo e calculam automaticamente estatísticas.

```javascript
import { Trend } from 'k6/metrics';

const createBookTrend = new Trend('create_book_duration');
```

Neste exemplo, crio uma métrica customizada chamada 'create_book_duration' para medir especificamente o tempo de criação de livros.

O código abaixo está armazenado no arquivo test/k6/performance-test.js e demonstra como utilizar a métrica Trend criada anteriormente.

```javascript
const start = Date.now();
const res = http.post(url, payload, params);
const duration = Date.now() - start;
createBookTrend.add(duration);
```

Neste exemplo, capturo o timestamp antes e depois da requisição HTTP POST, calculo a duração em milissegundos e adiciono o valor à métrica usando add(). O K6 calcula automaticamente min, max, avg, p90, p95, p99 desta métrica.

---

### 5. Faker

O código abaixo está armazenado no arquivo test/k6/performance-test.js e demonstra o uso do conceito de Faker. Faker é uma extensão do K6 que gera dados aleatórios realistas para testes.

```javascript
import faker from 'k6/x/faker';

const payload = JSON.stringify({
    titulo: faker.book.title(),
    autor: faker.book.author(),
    isbn: randomISBN(),
    ano: randomYear(),
    categoria: faker.book.genre()
});
```

Neste exemplo, utilizo diversos métodos do faker para gerar dados realistas e diferentes a cada iteração do teste. faker.book.title() gera títulos de livros aleatórios, faker.book.author() gera nomes de autores, e faker.book.genre() gera gêneros literários como Ficção, Fantasia, etc. Combino o faker com helpers customizados (randomISBN e randomYear) para máxima flexibilidade.

---

### 6. Variável de Ambiente

O código abaixo está armazenado no arquivo test/k6/helpers/getBaseUrl.js e demonstra o uso do conceito de Variável de Ambiente. Variáveis de ambiente permitem parametrizar testes sem modificar o código fonte.

```javascript
export function getBaseUrl() {
    return __ENV.BASE_URL || 'http://localhost:4010';
}
```

Neste exemplo, a função verifica se existe uma variável de ambiente BASE_URL definida através de __ENV.BASE_URL. Se não existir, utiliza o valor padrão 'http://localhost:4010'. Isso permite executar o mesmo teste em diferentes ambientes (desenvolvimento, homologação, produção) apenas alterando a variável de ambiente.

O código abaixo demonstra como usar a variável de ambiente ao executar o teste:

```bash
BASE_URL=http://api.production.com ./k6.exe run test/k6/performance-test.js
```

---

### 7. Stages

O código abaixo está armazenado no arquivo test/k6/performance-test.js e demonstra o uso do conceito de Stages. Stages definem diferentes fases de carga ao longo do tempo, simulando padrões realistas de tráfego.

```javascript
export let options = {
    stages: [
        { duration: '5s', target: 10 },  // Ramp up
        { duration: '20s', target: 10 }, // Average
        { duration: '5s', target: 20 },  // Spike
        { duration: '5s', target: 20 },  // Spike
        { duration: '5s', target: 10 },  // Average
        { duration: '5s', target: 0 },   // Ramp down
    ]
};
```

Neste exemplo, defino 6 fases de carga: aquecimento gradual de 0 para 10 VUs em 5 segundos (ramp up), carga estável de 10 VUs por 20 segundos (average load), pico rápido para 20 VUs em 5 segundos (spike testing), manutenção dos 20 VUs por 5 segundos (spike sustentado), retorno para 10 VUs em 5 segundos, e finalização gradual para 0 VUs em 5 segundos (ramp down). Cada objeto no array stages define uma fase com duration (duração) e target (número de usuários virtuais).

---

### 8. Reaproveitamento de Resposta

O código abaixo está armazenado no arquivo test/k6/performance-test.js e demonstra o uso do conceito de Reaproveitamento de Resposta. Este conceito consiste em extrair dados de uma requisição e utilizá-los em requisições subsequentes.

```javascript
let token = null;

group('Login', function () {
    token = login(user.login, user.senha);
});

group('Criar Livro', function () {
    const params = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
    const res = http.post(url, payload, params);
});

group('Listar Livros', function () {
    const params = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
    const res = http.get(url, params);
});
```

Neste exemplo, primeiro obtenho o token JWT através da função login no grupo Login. Este token é armazenado na variável token e reutilizado nos grupos subsequentes (Criar Livro e Listar Livros) através do header Authorization. Isso simula o fluxo real onde um usuário faz login uma vez e usa o token obtido para realizar múltiplas operações autenticadas.

---

### 9. Uso de Token de Autenticação

O código abaixo está armazenado no arquivo test/k6/helpers/login.js e demonstra o uso do conceito de Token de Autenticação. Token de autenticação JWT é usado para testar endpoints protegidos.

```javascript
export function login(username, password) {
    const url = `${getBaseUrl()}/auth/login`;
    const payload = JSON.stringify({ login: username, senha: password });
    const params = { headers: { 'Content-Type': 'application/json' } };
    
    const res = http.post(url, payload, params);
    return res.json('token');
}
```

Neste exemplo, a função realiza uma requisição POST para o endpoint de login enviando credenciais, e extrai o token JWT da resposta através de res.json('token').

O código abaixo está armazenado no arquivo test/k6/performance-test.js e demonstra como utilizar o token obtido para autenticar requisições subsequentes.

```javascript
const params = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }
};

const res = http.post(url, payload, params);
```

Neste exemplo, o token obtido é incluído no header Authorization usando o padrão Bearer Token (Authorization: Bearer <token>). Isso permite testar endpoints protegidos que exigem autenticação.

---

### 10. Data-Driven Testing

O código abaixo está armazenado no arquivo test/k6/data/users.test.data.json e demonstra o uso do conceito de Data-Driven Testing. Este conceito permite executar testes com diferentes conjuntos de dados carregados de arquivos externos.

```json
[
    { "login": "admin", "senha": "admin" },
    { "login": "user1", "senha": "senha1" },
    { "login": "user2", "senha": "senha2" }
]
```

Este arquivo externo contém um array de objetos com credenciais de diferentes usuários. Permite adicionar ou modificar usuários de teste sem alterar o código.

O código abaixo está armazenado no arquivo test/k6/performance-test.js e demonstra como carregar e utilizar os dados do arquivo JSON.

```javascript
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', function () {
    return JSON.parse(open('./data/users.test.data.json'));
});

export default function () {
    const user = users[(__VU - 1) % users.length];
    token = login(user.login, user.senha);
}
```

Neste exemplo, utilizo SharedArray para carregar os dados do arquivo JSON. SharedArray garante que os dados sejam carregados apenas uma vez e compartilhados entre todos os VUs, economizando memória. A fórmula (__VU - 1) % users.length distribui os usuários ciclicamente entre os VUs, garantindo que cada usuário virtual use um usuário específico do array.

---

### 11. Groups

O código abaixo está armazenado no arquivo test/k6/performance-test.js e demonstra o uso do conceito de Groups e dentro dele faço uso de um Helper, uma função de login, que foi importada de um outro script javascript.

```javascript
group('Login', function () {
    token = login(user.login, user.senha);
});

group('Criar Livro', function () {
    const url = `${getBaseUrl()}/books`;
    const payload = JSON.stringify({
        titulo: faker.book.title(),
        autor: faker.book.author(),
        isbn: randomISBN(),
        ano: randomYear(),
        categoria: faker.book.genre()
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
    const start = Date.now();
    const res = http.post(url, payload, params);
    const duration = Date.now() - start;
    createBookTrend.add(duration);
    check(res, { 'criar livro status 201': (r) => r.status === 201 });
});

group('Listar Livros', function () {
    const url = `${getBaseUrl()}/books`;
    const params = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
    const res = http.get(url, params);
    check(res, { 'listar livros status 200': (r) => r.status === 200 });
});
```

Neste exemplo, cada group() encapsula um conjunto de operações relacionadas, permitindo que o K6 agrupe as métricas por funcionalidade. Dentro do grupo Login, utilizo o Helper login() importado de outro arquivo, demonstrando a modularização do código. Os grupos aparecem separadamente nos relatórios, permitindo analisar a performance de cada funcionalidade individualmente.

---

## Análise de Resultados

Após a execução, o K6 apresenta:

- Métricas de thresholds (se passaram ou falharam)
- Percentual de checks bem-sucedidos
- Métricas customizadas (Trends)
- Métricas HTTP padrão (duração, taxa de falha, requisições por segundo)
- Métricas por grupo
- Estatísticas de VUs (Virtual Users) e iterações

## Estrutura do Fluxo de Teste

O teste executa o seguinte fluxo para cada Virtual User:

1. Seleciona um usuário do arquivo de dados (data-driven testing)
2. Realiza login e obtém token JWT (token authentication)
3. Cria um novo livro com dados aleatórios usando o token (faker + response reuse)
4. Lista todos os livros usando o token (response reuse)
5. Aguarda 1 segundo (think time)
6. Repete o ciclo conforme definido nos stages

## Observações

- Os dados de usuários podem ser alterados no arquivo test/k6/data/users.test.data.json
- A URL base pode ser configurada via variável de ambiente BASE_URL
- O Web Dashboard é acessível em http://localhost:5665 durante a execução
- O relatório HTML é gerado como html-report.html
- Erros são redirecionados para error.log para manter o console limpo
- Este projeto usa K6 customizado (k6.exe) com extensão faker

## Instalação do K6 Customizado

Para rebuild do K6 com extensão faker:

```bash
go install go.k6.io/xk6/cmd/xk6@latest
xk6 build --with github.com/grafana/xk6-faker@latest
```

Consulte INSTALL_FAKER.md para instruções detalhadas.
