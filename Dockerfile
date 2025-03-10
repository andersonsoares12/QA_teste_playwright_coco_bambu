# usando a imagem do playwright com java e node 
FROM mcr.microsoft.com/playwright:v1.51.0-noble

# Instalando dependências e o JDK 21
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    openjdk-21-jdk \
    && apt-get clean

# configurando o JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH="$[JAVA_HOME}/bin:${PATH}"