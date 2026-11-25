# API de Reserva de Salas

API REST para gerenciamento e reserva de salas e laboratórios, permitindo que usuários cadastrem contas, se autentiquem e realizem reservas de espaços em dias e horários específicos, sem conflitos de agenda.

Projeto desenvolvido como avaliação prática da disciplina de Desenvolvimento de API Backend.

## Funcionalidades previstas

- **Usuários**: cadastro, login e autenticação via JWT.
- **Salas**: cadastro, consulta, atualização e exclusão, respeitando permissões administrativas.
- **Reservas**: criação, consulta e cancelamento, com validação de conflito de horário para a mesma sala.
- **Validação**: validação dos dados recebidos em todas as requisições.
- **Segurança**: armazenamento de senhas com hash e controle de acesso por papel de usuário.
- **Tratamento de erros**: uso correto de códigos HTTP e padronização das respostas da API.
- **Testes**: cobertura automatizada dos principais recursos.

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express 5](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/) (ORM)
- [PostgreSQL](https://www.postgresql.org/) (banco de dados)
- [Zod](https://zod.dev/) (validação de entrada)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) (hash de senhas)
- [tsx](https://github.com/privatenumber/tsx) (execução em desenvolvimento)

## Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL em execução (local ou remoto)

## Como executar o projeto

1. Clone o repositório e instale as dependências:

   ```bash
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

   Edite o `.env`:

   | Variável         | Descrição                                            |
   | ---------------- | ---------------------------------------------------- |
   | `DATABASE_URL`   | Credenciais do seu PostgreSQL                        |
   | `ADMIN_EMAIL`    | E-mail do administrador inicial                      |
   | `ADMIN_NAME`     | Nome do administrador inicial (opcional)             |
   | `ADMIN_PASSWORD` | Senha do administrador inicial                       |
   | `PORT`           | Porta da API (opcional, padrão `3000`)               |

   O `.env` é ignorado pelo Git. Nunca commite a senha real do administrador.

3. Gere o client do Prisma:

   ```bash
   npx prisma generate
   ```

4. Aplique as migrations no banco:

   ```bash
   npx prisma migrate dev
   ```

5. Crie o usuário administrador inicial:

   ```bash
   npx prisma db seed
   ```

   O seed é idempotente: se o administrador já existir, nada é alterado, inclusive a senha, que não é sobrescrita. Para trocá-la, remova o usuário antes de rodar o seed novamente.

6. Inicie o servidor em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

   A API ficará disponível em `http://localhost:3000`.

7. Para verificar se o servidor está no ar, acesse:

   ```
   GET http://localhost:3000/health
   ```

   Resposta esperada:

   ```json
   { "status": "ok" }
   ```

## Endpoints

### Salas (`/rooms`)

| Método   | Rota         | Descrição                | Respostas                |
| -------- | ------------ | ------------------------ | ------------------------ |
| `GET`    | `/rooms`     | Lista todas as salas     | `200`                    |
| `GET`    | `/rooms/:id` | Busca uma sala por id    | `200`, `400`, `404`      |
| `POST`   | `/rooms`     | Cria uma sala            | `201`, `400`, `409`      |
| `PATCH`  | `/rooms/:id` | Atualização parcial      | `200`, `400`, `404`, `409` |
| `DELETE` | `/rooms/:id` | Remove uma sala          | `204`, `400`, `404`, `409` |

Corpo de `POST /rooms`:

```json
{ "number": 101, "type": "CLASSROOM", "active": true }
```

- `number`: inteiro positivo, obrigatório
- `type`: `LABORATORY` ou `CLASSROOM`, obrigatório
- `active`: booleano, opcional (padrão `true`)

O par `type` + `number` é único. Criar uma sala duplicada retorna `409`.

`PATCH` aceita qualquer subconjunto desses campos, exigindo ao menos um. Uma sala com reservas vinculadas não pode ser excluída (`409`).

### Formato de erro

Todas as respostas de erro seguem o mesmo formato:

```json
{ "message": "Sala não encontrada" }
```

Erros de validação incluem o detalhamento por campo:

```json
{
  "message": "Dados inválidos",
  "errors": [{ "field": "number", "message": "number deve ser maior que zero" }]
}
```

## Scripts disponíveis

| Comando                  | Descrição                                    |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Inicia o servidor com hot-reload (tsx watch) |
| `npm test`               | Roda a suíte de testes uma vez               |
| `npm run test:watch`     | Roda os testes em modo observação            |
| `npm run test:coverage`  | Roda os testes com relatório de cobertura    |
| `npm run typecheck`      | Verifica os tipos do projeto sem gerar build |
| `npx prisma generate`    | Regenera o client do Prisma                  |
| `npx prisma migrate dev` | Aplica as migrations pendentes               |
| `npx prisma db seed`     | Cria o usuário administrador inicial         |
| `npx prisma studio`      | Abre a interface visual do banco             |

Rode `npx prisma generate` sempre que o `schema.prisma` mudar. Um client desatualizado não enxerga colunas novas e devolve registros sem elas, sem erro algum.

## Testes

Stack: [Vitest](https://vitest.dev/) como runner e [Supertest](https://github.com/ladjs/supertest) para exercitar a API pela camada HTTP.

Os testes de integração rodam contra um PostgreSQL real, em um banco separado do de desenvolvimento. Antes da suíte, o banco de teste é criado se não existir e as migrations são aplicadas; antes de cada teste, as tabelas são truncadas.

Configure o banco de teste:

```bash
cp .env.test.example .env.test
```

A `DATABASE_URL` do `.env.test` precisa ter `test` no nome do banco. A suíte se recusa a rodar caso contrário, justamente para não apagar o banco de desenvolvimento por engano.

```bash
npm test
```

Organização:

```
tests/
├── helpers/     # Factories que criam User, Room e Reservation
├── integration/ # Requisições HTTP de ponta a ponta contra o banco real
├── setup/       # Criação do banco, migrations e limpeza entre testes
└── unit/        # Funções isoladas, sem banco
```

A aplicação Express mora em `src/app.ts` e o `src/server.ts` apenas sobe o listener. Essa separação permite que o Supertest importe o app sem abrir uma porta.

## Modelo de dados

| Entidade      | Campos                                                       |
| ------------- | ------------------------------------------------------------ |
| `User`        | `id`, `name`, `email` (único), `passwordHash`, `role`         |
| `Room`        | `id`, `number`, `type`, `active` (único por `type`+`number`)   |
| `Reservation` | `id`, `userId`, `roomId`, `start`, `end`, `status`            |

Todas as entidades possuem `createdAt` e `updatedAt`. O `updatedAt` é mantido pelo Prisma Client, então atualizações feitas por SQL direto no banco não o alteram.

Enums: `Role` (`USER`, `ADMIN`), `RoomType` (`LABORATORY`, `CLASSROOM`), `ReservationStatus` (`ACTIVE`, `CANCELLED`).

As entidades usam terminologia em inglês; as mensagens da API são em português.

## Estrutura do projeto

```
.
├── prisma/
│   ├── migrations/       # Histórico de migrations
│   ├── schema.prisma     # Definição do banco de dados
│   └── seed.ts           # Criação do administrador inicial
├── src/
│   ├── controllers/      # Parse da requisição e montagem da resposta
│   ├── errors/           # AppError, erro de domínio com status HTTP
│   ├── lib/              # Client do Prisma e utilitários de senha
│   ├── middlewares/      # Tratamento centralizado de erros
│   ├── repositories/     # Acesso ao banco via Prisma
│   ├── routes/           # Definição das rotas Express
│   ├── schemas/          # Schemas de validação Zod
│   ├── services/         # Regras de negócio
│   ├── app.ts            # Montagem da aplicação Express
│   └── server.ts         # Ponto de entrada (sobe o listener)
├── tests/
│   ├── helpers/          # Factories de dados
│   ├── integration/      # Testes HTTP contra o banco real
│   ├── setup/            # Preparação e limpeza do banco de teste
│   └── unit/             # Testes de funções isoladas
├── prisma.config.ts      # Configuração do Prisma
├── vitest.config.ts      # Configuração dos testes
├── tsconfig.json         # Configuração do TypeScript
├── .env.example          # Modelo das variáveis de ambiente
├── .env.test.example     # Modelo das variáveis do banco de teste
└── package.json
```

A requisição percorre as camadas nesta ordem: **rota → controller → service → repository**. O controller não conhece o Prisma, e o service não conhece o Express.

## Status atual

- Modelagem completa das entidades `User`, `Room` e `Reservation`, com `createdAt`/`updatedAt` e migrations aplicadas
- CRUD de salas com validação Zod, unicidade por `type`+`number` e bloqueio de exclusão de sala com reservas
- Tratamento centralizado de erros, traduzindo `AppError`, erros do Zod e violações de constraint do Prisma (`P2002`, `P2003`, `P2025`) para os códigos HTTP corretos
- Seed idempotente do usuário administrador inicial, com senha em hash bcrypt
- Endpoint de verificação de saúde (`/health`)
- Suíte de testes com Vitest e Supertest, cobrindo o CRUD de salas de ponta a ponta contra um banco PostgreSQL dedicado

## Equipe

Projeto desenvolvido em grupo para a disciplina de Desenvolvimento de API Backend.
