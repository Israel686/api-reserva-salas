# API de reserva de salas — Semana 15

Estrutura inicial com Express, TypeScript, Prisma 7 e PostgreSQL. Use Node.js 22.12 ou superior na linha 22, ou Node.js 24 LTS.

## Rodar a API

```powershell
npm install
npm run dev
```

Acesse `http://localhost:3000/health`. A resposta esperada é `{"status":"ok"}`. Essa rota confirma que o Express está rodando.

## Configurar o PostgreSQL

1. Com o PostgreSQL em execução, crie um banco chamado `reserva_salas` pelo pgAdmin.
2. Se ainda não tiver um `.env` na raiz, copie o `.env.example` para `.env`.
3. Ajuste o usuário, a senha, o host e a porta em `DATABASE_URL`. Mantenha o `.env` fora do Git.
4. No PowerShell, execute `'SELECT 1;' | npx prisma db execute --stdin` para verificar a conexão. A consulta não cria tabelas.

## Arquivos principais

- `src/server.ts`: inicia o Express e registra a rota `/health`.
- `prisma/schema.prisma`: define PostgreSQL como banco e prepara o gerador do cliente para a próxima etapa.
- `prisma.config.ts`: indica onde está o schema e lê o endereço do banco a partir do `.env`.
- `tsconfig.json`: configura a verificação de tipos, disponível via `npm run typecheck`.

Os modelos e as migrations entram na Semana 16.
