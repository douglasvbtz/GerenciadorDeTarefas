# Usar uma imagem base do Node.js
FROM node:14

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o arquivo package.json e instalar as dependências
COPY package.json .
RUN npm install

# Copiar todos os arquivos da aplicação
COPY . .

# Expor a porta 3000 para acesso ao backend
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "app.js"]
