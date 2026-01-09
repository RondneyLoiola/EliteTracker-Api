# 🎯 EliteTracker API

API RESTful desenvolvida em TypeScript para gerenciamento e rastreamento de dados do projeto EliteTracker.

## 📋 Sobre o Projeto

EliteTracker API é uma API backend robusta construída com Node.js e TypeScript, projetada para melhorar a produtividade do dia a dia

## 🚀 Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **TypeScript** - Superset JavaScript com tipagem estática
- **Express** - Framework web minimalista e flexível
- **Biome** - Linter e formatador de código moderno

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/RondneyLoiola/EliteTracker-Api.git
cd EliteTracker-Api
```

2. **Instale as dependências**

Usando npm:
```bash
npm install
```

Ou usando yarn:
```bash
yarn install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo de exemplo e configure suas variáveis:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development
# Adicione outras variáveis conforme necessário
```

## ▶️ Como Executar

### Modo de Desenvolvimento

```bash
npm run dev
```
ou
```bash
yarn dev
```

### Modo de Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
EliteTracker-Api/
├── src/                  # Código fonte da aplicação
│   ├── controllers/      # Controladores das rotas
│   ├── models/          # Modelos de dados
│   ├── routes/          # Definição de rotas
│   ├── services/        # Lógica de negócio
│   ├── middlewares/     # Middlewares personalizados
│   └── index.ts         # Arquivo principal
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
├── biome.json          # Configuração do Biome
├── package.json        # Dependências e scripts
├── tsconfig.json       # Configuração do TypeScript
└── README.md           # Documentação do projeto
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em modo de produção
- `npm run lint` - Verifica o código com Biome
- `npm run format` - Formata o código automaticamente

## Interface Elite Tracker
- https://github.com/RondneyLoiola/elite-tracker-frontend
