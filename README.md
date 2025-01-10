# AgilStore - Product Management Challenge

### Tecnologias

- **Banco de Dados**: SQLite3
- **Back-end**: Express, TypeScript, Joi, Better-Sqlite3, TS-Node, Nodemon
- **Front-end**: React, Material UI, React Data Table, Material Icons

### Variáveis de ambiente dotenv

- Consulte o arquivo `.env.example` na raiz do projeto para saber quais variáveis são necessárias.

### Sobre a execução do projeto

- Antes de executar o projeto é importante ter uma versão recente do NodeJs instalada em seu computador, configurar as variáveis de amabiente `env`, e também instalar as dependências do projeto por meio do comando `npm install`.

### Scripts

- `npm run dev`: Inicia o desenvolvimento (backend + frontend).
- `npm run build`: Compila o projeto para produção.
- `npm start`: Inicia o servidor com o backend e front-end em produção.
- `npm run build-and-run`: Compila o projeto e inicia o servidor em produção no endereço especificado no terminal.

### URL de acesso ao projeto

    - **Backend** http://localhost:3000/api
    Via Postman ou Insomnia

    - **Frontend** http://localhost:3000/
    Via Browser (navegador)

### Rotas do Backend

#### `GET /api/products/`
Busca todos os produtos.
- **Body**: Não se aplica.

#### `GET /api/products/:id`
Busca um produto por um ID (integer e positivo) específico.
- **Body**: Não se aplica.

#### `GET /api/products/search`
Busca todos os produtos com parte do nome passada na query string (`product_name`).
- **Query**: `product_name`
- **Body**: Não se aplica.

#### `POST /api/products/`
Cria um novo registro.
- **Body**: `{ product_name: string, category:string, stock: number, price: number }`

#### `PUT /api/products/:id`
Atualiza um registro pelo ID.
- **Body**: `{ product_name: string, category:string, stock: number, price: number }`

#### `DELETE /api/products/:id`
Exclui um registro pelo ID.
- **Body**: Não se aplica.

Para mais detalhes, consulte o código fonte.