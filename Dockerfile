FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências
RUN npm install

# Copiar tsconfig e código fonte
COPY tsconfig.json ./
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Remover devDependencies para produção
RUN npm prune --production

# Expor porta (Render usa porta dinâmica, mas isso é só documentação)
EXPOSE 4000

# Iniciar aplicação
CMD ["npm", "start"]