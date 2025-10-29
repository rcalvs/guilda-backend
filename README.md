# Guilda Backend

Backend API desenvolvido para o projeto [Guilda](https://github.com/rcalvs/guilda), uma aplicação de gerenciamento de guildas que auxilia o frontend com operações de banco de dados.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web para Node.js
- **Redis** - Banco de dados em memória para armazenamento de dados
- **ioredis** - Cliente Redis para Node.js
- **CORS** - Middleware para habilitar Cross-Origin Resource Sharing
- **Morgan** - Middleware de logging para HTTP requests
- **UUID** - Geração de identificadores únicos
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

```
guilda-backend/
├── config/
│   └── redisClient.js      # Configuração do cliente Redis
├── controllers/
│   ├── adController.js     # Lógica para anúncios
│   ├── riftController.js   # Lógica para rifts
│   └── storeController.js  # Lógica para lojas
├── middleware/
│   └── apiKey.js          # Middleware de autenticação por API Key
├── routes/
│   ├── adRoutes.js        # Rotas para anúncios
│   ├── riftRoutes.js      # Rotas para rifts
│   └── storeRoutes.js     # Rotas para lojas
├── index.js               # Arquivo principal da aplicação
└── package.json           # Dependências e scripts
```

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- Redis Server (local ou cloud)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd guilda-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env na raiz do projeto
PORT=3005
API_KEY=sua_api_key_aqui
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=sua_senha_redis
```

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `PORT` | Porta do servidor | 3005 |
| `API_KEY` | Chave de API para autenticação | - |
| `REDIS_HOST` | Host do Redis | localhost |
| `REDIS_PORT` | Porta do Redis | 6379 |
| `REDIS_PASS` | Senha do Redis | - |

## 🚀 Como Executar

### Desenvolvimento

```bash
npm start
```

O servidor estará rodando em `http://localhost:3005`

### Produção

O projeto está configurado para deploy no Render.com e outras plataformas de cloud.

## 📚 API Endpoints

### Autenticação
Todas as rotas requerem o header `x-api-key` com a chave configurada nas variáveis de ambiente.

### Anúncios (`/ads`)
- `POST /ads` - Criar novo anúncio
- `GET /ads` - Listar todos os anúncios
- `GET /ads/:id` - Obter anúncio por ID
- `PUT /ads/:id` - Atualizar anúncio
- `DELETE /ads/:id` - Deletar anúncio

### Lojas (`/stores`)
- `POST /stores` - Criar nova loja
- `GET /stores` - Listar todas as lojas
- `GET /stores/:id` - Obter loja por ID
- `PUT /stores/:id` - Atualizar loja
- `DELETE /stores/:id` - Deletar loja

### Rifts (`/rifts`)
- `POST /rifts` - Criar novo rift
- `GET /rifts` - Listar todos os rifts
- `GET /rifts/:id` - Obter rift por ID
- `PUT /rifts/:id` - Atualizar rift
- `DELETE /rifts/:id` - Deletar rift

## 🏗️ Arquitetura e Práticas

### Padrões Utilizados

- **MVC (Model-View-Controller)** - Separação clara de responsabilidades
- **Middleware Pattern** - Interceptação de requests para autenticação
- **RESTful API** - Endpoints seguindo convenções REST
- **Environment Configuration** - Configuração via variáveis de ambiente

### Banco de Dados

O projeto utiliza **Redis** como banco de dados principal, oferecendo:
- Armazenamento em memória para alta performance
- Estrutura de chave-valor simples e eficiente
- Suporte a operações atômicas
- Persistência opcional em disco

### Segurança

- **API Key Authentication** - Todas as rotas protegidas por chave de API
- **CORS** - Configurado para permitir requisições cross-origin controladas
- **Input Validation** - Validação básica de dados de entrada

### Estrutura de Dados

Os dados são armazenados no Redis com as seguintes chaves:
- `ad:{id}` - Anúncios
- `store:{id}` - Lojas  
- `rift:{id}` - Rifts

## 🔗 Integração com Frontend

Este backend foi desenvolvido especificamente para integrar com o frontend do projeto [Guilda](https://github.com/rcalvs/guilda), fornecendo:

- API RESTful para operações CRUD
- Autenticação via API Key
- Respostas em JSON padronizadas
- Tratamento de erros consistente

## 📝 Exemplo de Uso

```bash
# Criar um novo anúncio
curl -X POST http://localhost:3005/ads \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua_api_key" \
  -d '{"title": "Novo Anúncio", "description": "Descrição do anúncio"}'

# Listar todos os anúncios
curl -X GET http://localhost:3005/ads \
  -H "x-api-key: sua_api_key"
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.