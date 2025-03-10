# Playwright + Docker + Jenkins + Allure Report + VS Code

## 📌 Sobre o Projeto
Este repositório contém uma configuração completa para executar testes automatizados com Playwright em um ambiente Docker, integrado com Jenkins para CI/CD e geração de relatórios usando Allure Report. Além disso, o projeto é otimizado para desenvolvimento no VS Code.

---

## 🚀 Configuração do Ambiente

### 1️⃣ Criar o Projeto Playwright
Execute os seguintes comandos para iniciar o projeto:
```sh
npm init playwright@latest
```
Isso criará uma estrutura básica com Playwright configurado.

---

### 2️⃣ Adicionar Suporte ao Docker
Crie um arquivo `Dockerfile` na raiz do projeto:
```dockerfile
FROM mcr.microsoft.com/playwright:v1.42.0

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["npx", "playwright", "test"]
```
Agora, crie um arquivo `docker-compose.yml`:
```yaml
version: '3.8'

services:
  tests:
    build: .
    container_name: playwright-tests
    volumes:
      - .:/app
    command: ["npx", "playwright", "test"]
```
Para testar se tudo está funcionando:
```sh
docker build -t playwright-tests .
docker run --rm playwright-tests
```

---

### 3️⃣ Integrar com o Jenkins
Se ainda não tiver o Jenkins instalado, execute:
```sh
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```
Agora, dentro do Jenkins:
1. Instale os plugins: **Pipeline, Allure Report, Docker Pipeline**.
2. Crie um novo pipeline e adicione o seguinte `Jenkinsfile`:
3. Instale o docker, docker pipeline nos plugins do jenkins
4. nas configurações do jenkins na pipeline criada adicione o Allure report
5. Adicione o projeto ao Jenkins e execute o pipeline.

---

### 4️⃣ Configurar o Allure Report
Instale o Allure no projeto:
```sh
npm install --save-dev @playwright/test allure-playwright
```
Atualize o `playwright.config.ts`:
```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['line'],
    ['allure-playwright']
  ],
});
```
Para gerar o relatório:
```sh
npm i allure-commandline
npx allure generate allure-results --clean && npx allure open
```

---

### 5️⃣ Configurar no VS Code
1. Instale as extensões **Playwright Test for VS Code** e **Docker**.
2. Crie um arquivo `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run Playwright Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/playwright",
      "args": ["test"],
      "console": "integratedTerminal"
    }
  ]
}
```
Agora você pode rodar os testes diretamente no VS Code!

---

## 🎯 Executando os Testes
Rodar localmente:
```sh
npx playwright test
```
Rodar com Docker:
```sh
docker-compose up --build
```
Rodar no Jenkins:
1. Configure o pipeline
2. Execute o build no Jenkins

---

## 📊 Visualizando os Relatórios
Gerar e visualizar o relatório Allure:
```sh
npx allure generate allure-results --clean && npx allure open
```

---

## 📌 Conclusão
Agora você tem um ambiente completo para testes automatizados com Playwright, Docker, Jenkins e Allure, tudo pronto para rodar no VS Code! 🚀

