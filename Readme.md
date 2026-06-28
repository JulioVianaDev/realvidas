# Migrações TypeORM

<details>
  <summary><strong>Comandos de banco de dados (main + tenant)</strong></summary>

O backend usa **TypeORM** com arquitetura multitenant: banco **main** (`public`) e schemas **tenant** (`tenant_<uuid>`).

Migrações ficam em:

- `apps/backend/src/infra/postgres-databases/main/migrations/`
- `apps/backend/src/infra/postgres-databases/tenant/migrations/`

## Comandos (executar na raiz do monorepo)

| Comando | Descrição |
| ------- | --------- |
| `npm run db:run:main` | Aplica migrações do banco main |
| `npm run db:run:tenant` | Aplica migrações em `tenant_template` e todos os tenants |
| `npm run db:generate:main` | Gera nova migração main (dev) |
| `npm run db:generate:tenant:all` | Gera nova migração tenant (dev) |
| `npm run seed` | Popula dados iniciais |

### Fluxo típico

1. Suba o PostgreSQL (`docker-compose up -d`).
2. Rode `npm run db:run:main`.
3. Rode `npm run db:run:tenant`.
4. (Opcional) Rode `npm run seed`.
5. Inicie o backend com `npm run dev:backend`.

</details>

# Setup do Projeto

<details>

Este projeto é um **monorepo Nx** com workspaces npm. Requer **Docker** para os serviços de infraestrutura.

## Requisitos

- Docker + Docker Compose
- Node.js 22+

## Passo a passo (raiz do repositório)

### 1. Configurar ambiente

Renomeie `.env.example` para `.env` e ajuste as variáveis.

### 2. Subir infraestrutura

```sh
docker-compose up -d --build
```

### 3. Instalar dependências

```sh
npm install
```

### 4. Rodar migrações TypeORM

```sh
npm run db:run:main
npm run db:run:tenant
```

### 5. Desenvolvimento

```sh
# Backend + frontend + packages (types, email-templates)
npm run dev
```

Ou individualmente:

```sh
npm run dev:backend
npm run dev:frontend
```

## Produção

```sh
npm run build
npm run db:run:main
npm run db:run:tenant
pm2 start ecosystem.config.cjs
```

Veja também `NX.md` e `deploy.sh` para deploy completo.

</details>

# Seeding

<details>

  ## Rodar o script de seed

  ```sh
    npm run seed
  ```

  ## Com isto iremos criar um usuário chamado admin@admin.com com a senha admin para testar o projeto

</details>
