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