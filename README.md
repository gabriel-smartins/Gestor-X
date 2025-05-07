# GestorX - Sistema de Gerenciamento de Estoque

## 📦 Instalação

Para executar este projeto localmente, siga os passos abaixo:

### 1. Após descompactar o projeto

Abra o projeto no  Terminal / CMD.

### 2. Instale as dependências do frontend e backend:

bash
# Instale as dependências do backend
cd server
npm install

# Instale as dependências do frontend
cd frontend
npm install

### 3. Configure as variáveis de ambiente:

Edite o arquivo .env dentro do diretório server com o seguinte conteúdo:

PORT=[Sua Porta]
MONGO_DB_URI=[URL de Conexão com o MongoDB]
JWT_SECRET=[Sua Chave Secreta]

# Inicie o servidor backend
cd server
npm start

# Inicie o servidor frontend
cd frontend
npm run dev

# Execute o comando "node seed.js" na raiz do projeto
node seed.js

# Efetue o login 
email: admin@gmail.com
senha: admin

⚙️ Notas Adicionais
Certifique-se de ter o Node.js e o npm instalados em seu sistema.

Tanto o frontend quanto o backend precisam estar em execução simultaneamente para o sistema funcionar corretamente.

Para o banco de dados MongoDB, utilize o MongoDB Compass ou configure uma conexão com o MongoDB Atlas.


