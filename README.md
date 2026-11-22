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
- [tsx](https://github.com/privatenumber/tsx) (execução em desenvolvimento)

## Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL em execução (local ou remoto)

## Como executar o projeto

1. Clone o repositório e instale as dependências:

   ```bash
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e ajuste a conexão com o banco:

   ```bash
   cp .env.example .env
   ```

   Edite o valor de `DATABASE_URL` com as credenciais do seu banco PostgreSQL.

3. Gere o client do Prisma:

   ```bash
   npx prisma generate
   ```

   > As migrations (`npx prisma migrate dev`) ainda não se aplicam, pois o `schema.prisma` não possui models definidos. Esse passo será adicionado assim que as entidades de Usuário, Sala e Reserva forem modeladas.

4. Inicie o servidor em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

   A API ficará disponível em `http://localhost:3000`.

5. Para verificar se o servidor está no ar, acesse:

   ```
   GET http://localhost:3000/health
   ```

   Resposta esperada:

   ```json
   { "status": "ok" }
   ```

## Scripts disponíveis

| Comando             | Descrição                                    |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Inicia o servidor com hot-reload (tsx watch) |
| `npm run typecheck` | Verifica os tipos do projeto sem gerar build |

## Estrutura do projeto

```
.
├── prisma/
│   └── schema.prisma     # Definição do banco de dados (Prisma + PostgreSQL)
├── src/
│   └── server.ts         # Ponto de entrada da API (Express)
├── prisma.config.ts      # Configuração do Prisma
├── tsconfig.json         # Configuração do TypeScript
├── .env.example          # Modelo das variáveis de ambiente
└── package.json
```

## Status atual

O projeto está na etapa inicial de estruturação: ambiente configurado, Prisma configurado com provider PostgreSQL (ainda sem models definidos) e um endpoint de verificação de saúde (`/health`) implementado.

Próximas etapas no decorrer das semanas seguintes incluem a modelagem das entidades de Usuário, Sala e Reserva, a implementação da autenticação JWT e das rotas de CRUD de salas e reservas.

## Equipe

Projeto desenvolvido em grupo para a disciplina de Desenvolvimento de API Backend.
