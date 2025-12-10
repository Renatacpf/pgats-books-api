# Instruções de Instalação do K6 com Faker

## Pré-requisito: Instalar Go (Golang)

### Opção 1: Via Winget (Windows)
```bash
winget install GoLang.Go
```

### Opção 2: Download Manual
1. Acesse: https://go.dev/dl/
2. Baixe o instalador para Windows
3. Execute o instalador e siga as instruções
4. Reinicie o terminal após a instalação

## Verificar instalação do Go
```bash
go version
```

## Instalar xk6

Após instalar o Go, execute:

```bash
go install go.k6.io/xk6/cmd/xk6@latest
```

## Buildar K6 com extensão Faker

Navegue até o diretório do projeto:

```bash
cd C:/Users/User/Renata/PosGraduacao/ProjetosJavaScript/pgats-books-api
```

Execute o build do K6 com a extensão faker:

```bash
xk6 build --with github.com/grafana/xk6-faker@latest
```

Isso criará um executável `k6.exe` no diretório atual com a extensão faker integrada.

## Executar testes com o K6 customizado

```bash
# Teste básico
./k6.exe run test/k6/performance-test.js

# Com Web Dashboard e relatório HTML
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html K6_WEB_DASHBOARD_PERIOD=2s ./k6.exe run test/k6/performance-test.js
```

## Observações

- O `k6.exe` gerado pelo xk6 substituirá temporariamente o K6 padrão para este projeto
- Você pode renomear o executável para `k6-faker.exe` se quiser manter ambas as versões
- A extensão faker já está integrada no código do projeto em `test/k6/performance-test.js`
