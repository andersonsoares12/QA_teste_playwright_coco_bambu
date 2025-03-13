# Playwright + Docker + Jenkins + Allure Report + VS Code

## 📌 Sobre o Projeto
Este repositório contém uma configuração completa para executar testes automatizados com **Playwright** em um ambiente **Docker**, integrado com **Jenkins** para CI/CD e geração de relatórios usando **Allure Report**. Além disso, o projeto é otimizado para desenvolvimento no **VS Code**. 
*** OBS: sé e necessario fazer a configuração do Docker + Jenkins se quiser implementar o CI/CD do Jenkins ***

*** Ao utilizar o Vscode instalar o plugin do playwright for VsCode o plugin do docker para rodar todos os testes com mais facilidade. ***

---

## 🚀 Configuração do Ambiente

### 1️⃣ Instalação das Dependências

#### 🔹 Instalar Node.js

##### **Windows**:
Baixe e instale o Node.js a partir do site oficial:

🔗 [Node.js Download](https://nodejs.org/)

Após a instalação, verifique a versão:
```sh
node -v
npm -v
```

##### **macOS**:
Instale o Node.js via Homebrew:
```sh
brew install node
```
Inicialize o projeto node
```sh
npm init 
```

Verifique a versão:
```sh
node -v
npm -v
```

#### 🔹 Instalar Playwright
Execute o seguinte comando para criar um novo projeto Playwright:
```sh
npm init playwright@latest
```
Isso criará a estrutura básica com Playwright configurado.

#### 🔹 Instalar Allure Report
```sh
npm install --save-dev @playwright/test allure-playwright
npm i allure-commandline
```

Atualize o `playwright.config.ts`:

import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [

    allure-playwright   //adcione somente essa parte dentro do reporter
  ],
});


Para gerar e visualizar o relatório: rode primeiro o "npx playwright teste" de pois o comando do allure
se estiver correto vai iniciar o servidor do allure no navegador
```sh
allure generate ./allure-results -o ./allure-report --clean && allure open ./allure-report
```

---

## Execução rapida do prejeto locamente :

```sh
npx playwright test
allure generate ./allure-results -o ./allure-report --clean && allure open ./allure-report
---
```
####  🔹 **ESSA INSTALAÇÃO SO E NECESSARIA CASO QUEIRA UMA ESTEIRA DE CI/CD COM JENKINS** 
### 2️⃣ Instalação do Docker

##### **Windows**:
Baixe e instale o **Docker Desktop**:
🔗 [Docker for Windows](https://www.docker.com/products/docker-desktop)

##### **macOS**:
Instale o Docker via Homebrew:
```sh
brew install --cask docker
```
Inicie o **Docker Desktop** antes de prosseguir.

crie o arquivo docker-compose.yml na raiz do projeto antes de prosseguir:
e faça o seguinte:

version: '3.8'

services:
  //Serviço de Jenkins para integração contínua
  jenkins:
    build: ./jenkins                // Usa o Dockerfile localizado na pasta ./jenkins
    container_name: jenkins-server  //Define um nome amigável para o contêiner
    privileged: true                // Concede permissões elevadas ao contêiner (necessário para Docker-in-Docker)
    user: root                      # Executa o contêiner como usuário root para garantir permissões
    networks:
      - bambunet            # Conecta o Jenkins à rede Docker chamada 'skynet'
    restart: always                 # Reinicia automaticamente o contêiner em caso de falha
    environment:
      - TZ=America/Sao_Paulo        # Define o fuso horário do contêiner para São Paulo
    ports:
      - "8080:8080"                 # Mapeia a porta 8080 do host para a interface web do Jenkins
      - "50000:50000"               # Mapeia a porta para comunicação com agentes Jenkins
    volumes:
      - jenkins_home:/var/jenkins_home             # Persiste dados do Jenkins no volume 'jenkins_home'
      - /var/run/docker.sock:/var/run/docker.sock  # Permite que o Jenkins use Docker do host

# Volumes
volumes:
  jenkins_home:                 # Persistência de dados do Jenkins

# Redes
networks:
  bambunet:                       # Rede Docker para comunicação entre contêineres
    driver: bridge

deve abrir o docker desktop se estiver instalado
agora inicie o servidor do docker:

macOs:
```sh
open -a Docker
docker info
```

windows
```sh
start-process -NoNewWindow -FilePath "C:\Program Files\Docker\Docker\Docker Desktop.exe"
verifica:
docker info
```

Crie tambem o seguinte container contendo a imagem do do playwright com java e nodeJs configurados  
criando o arquivo Dockerfile na RAIZ do projeto insira o seguinte:
```bash
# Usando a imagem Playwright com Java e Node
FROM mcr.microsoft.com/playwright:v1.51.0-noble

# Instalando dependências e o JDK 21
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    openjdk-21-jdk \
    && apt-get clean

# Configurando corretamente a variável JAVA_HOME
ENV export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-arm64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Testando se o Java está instalado corretamente
RUN java -version

```
# para rodar a imagem dentro do docker localmente execute o seguinte comando

```sh
docker build -t mogoose/playwright-nj-v1.51.0-noble .  
```

---

### 3 Instalação do Jenkins

# crie na RAIZ do projeto o arquivo chamado : Jenkinsfile ele e quem vai ser responsave,m por criar a pipeline de execução dos scripts dos estagios dos testes configure da maneira que achar melhor
```sh
pipeline {
    agent {
        docker {
            image 'mogoose/playwright-nj-v1.51.0-noble'  // imagem docker com playwright instalado com nodeJs e Java
            args '--network testes_branch_bambunet'  // parte inportante para acessar a rede interna 
        }
    }
    
    environment {
        JAVA_HOME = "/usr/lib/jvm/java-21-openjdk-arm64"  // caminho do java
        PATH = "$JAVA_HOME/bin:$PATH"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install' // instala as dependencias do projeto
            }
        }

        stage('Run Tests E2E') {
            steps {
                sh 'npx playwright test'  // executa os testes
                allure includeProperties: false, jdk: 'default', results: [[path: 'allure-results']]   // gera o relatorio allure
            }
        }
    }
    
}
```

#### **Windows**:
Baixe e instale o Jenkins:
```sh
🔗 [Jenkins Download](https://www.jenkins.io/download/)
````

Após a instalação, inicie o serviço e acesse no navegador:
```sh
http://localhost:8080
```

#### **macOS**:
_ Instale o Jenkins via site official  "https://www.jenkins.io/doc/book/installing/docker/":  ja no link do docker
- va ate o item número 4 e copie e cole no arquivo Dockerfile dentro ta pasta jenkins na raiz do projeto onde vai ter toda configuração para iniciar o container do jenkins

```sh
FROM jenkins/jenkins:2.492.2-jdk17
USER root
RUN apt-get update && apt-get install -y lsb-release
RUN curl -fsSLo /usr/share/keyrings/docker-archive-keyring.asc \
  https://download.docker.com/linux/debian/gpg
RUN echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.asc] \
  https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
RUN apt-get update && apt-get install -y docker-ce-cli
USER jenkins
RUN jenkins-plugin-cli --plugins "blueocean docker-workflow"
```
*** feito tada a configuração hora de subir o container do jenkins no Docker: ***
```sh
docker-compose up -d
```
*** Acesse o Jenkins no navegador: ***
*** porta padrao ***

```sh
http://localhost:8080
Usuario: admin
senha: admin
```

vai pedir a senha de administrador do jenkins
onde achar:
comandos terminal
```sh
docker ps
```
vai copiar o id do container e digitar 
```sh
docker logs <ebb7f9ded9fd> 
```
#vai aparecer exatamente dessa forma:
```sh
Please use the following password to proceed to installation:
729ba19222ce42ba885591c58c76c7f5
```
# feito toda a configuração e hora de fazer o commit no GITHUB e pegar o caminho para configurar o jenkins

*** Agora, dentro do Jenkins: ***

1. Instale os plugins: **Pipeline, Allure Report, Docker Pipeline**.
2. Crie um novo pipeline e adicione o seguinte `Jenkinsfile`:
3. Configure a integração do Allure Report.
4. Adicione o projeto ao Jenkins e execute o pipeline.
5. vai cofigurar o jenkins instalando suas extensões da melhor forma.
6. ao finalizar crie o usuario administrador
7. agora instale os seguintes plugins:
8. clique em extensões disponíveis
9. va em gerenciae Jenkins - ele ja deve pedir para fazer algumas instalações necessarias de dependencias clique em corrigir 
10. busque por docker e docker pipeline
11. depois allure 
12. marque o checkbox para reiniciar quando terminar
13. verifique se o servidor do docker deligou e o religue novamente
14. pronto agora vamos criar a pipeline de teste - clique em gerenciar Jenkins e clique em nova tarefa.
15. adicione uma nova tarefa e selecione pipeline - pegue o caminho do seu projeto github
16. vá em Pipeline - Definition - mude para Pipeline script from SCM
17. em SCM - mude para Git
18. repositories - coloque o repositorio do pejeto Git .
19. em Branches to build - mude para a branch que voce quer utilizar
20. agora clique em Pipeline Syntax - deve ja vir selecionado o allure Report
21. vai esta pedindo para adicionar o Allure comandoline clique em Global Tool configurationrole ate encontrar 
22. vai abrir outra tela role ate achar - Adicionar Allure CommandLine
23. Coloque o Nome Allure - verifique a versão  e clique em Generate Pipeline Script peqgue o que foi gerado e cole:
24. no arquivo Jenkinsfile no stage do report:
```sh
stage('Generate Allure Report') {
            steps {
                sh '''
                    echo "Setting up Allure report..."
                    /var/jenkins_home/tools/ru.yandex.qatools.allure.jenkins.tools.AllureCommandlineInstallation/allure/bin/allure generate allure-results -c -o allure-report
                '''
                allure includeProperties: false, jdk: 'default', results: [[path: 'allure-results']]
            }
        }  
```


# **Rodar Jenkins via Docker**:   opcional
```sh
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```

---

### 5️⃣ Executando os Testes localmente sem precisar subir para uma pipeline do jenkins
*** Rodar localmente: ***
```sh
npx playwright test
```

---

# 📊 Visualizando os Relatórios localmente
*** Gerar e visualizar o relatório Allure: ***

```sh
allure generate ./allure-results -o ./allure-report --clean && allure open ./allure-report
```

---
*** Comandos para rodor todos os casos de testes no terminal ***
- npx playwright test 01_login_sucesso.spec.js
- npx playwright test 02_adicionando_ao_carrinho_validando_cartao_credito.spec.ts
- npx playwright test 03_removendo_itens_da_sacola.spec.ts
- npx playwright test 04_localizacao_loja_perto.spec.ts

# ** Teste e API ** Não precisa de configuração nenhuma ja foi consfigurado
*** comando para rodar os testes de api e o Allure report para visializar o relatório ***

```sh
npx playwright test cart-api.spec.js  
```
```sh
allure generate ./allure-results -o ./allure-report --clean && allure open ./allure-report
```

## 📌 Conclusão
Agora você tem um ambiente completo para testes automatizados com **Playwright, Docker, Jenkins e Allure**, tudo pronto para rodar no **VS Code**! 🚀

