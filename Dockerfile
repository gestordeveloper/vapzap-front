# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm ci

# Copia o código fonte
COPY . .

# Argumento para URL da API (pode ser sobrescrito no docker-compose)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Realiza o build da aplicação Vue/Vite
RUN npm run build

# Expõe a porta 80 que será usada pelo vite preview
EXPOSE 80

# Comando final para rodar o frontend no servidor usando vite preview
CMD ["npm", "run", "preview", "--", "--port", "80", "--host", "0.0.0.0"]
