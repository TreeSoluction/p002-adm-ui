# Etapa 1: Construção
FROM node:22 AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package.json yarn.lock ./

# Instala as dependências usando Yarn
RUN yarn install

# Copia o restante dos arquivos do projeto
COPY . .

# Gera a build da aplicação
RUN yarn build

# Etapa 2: Execução
FROM node:22

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos da etapa de construção
COPY --from=builder /app ./

# Expõe a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["yarn", "start"]