# CI/CD - realvidas Monorepo

## Visao Geral

O CI/CD usa **GitHub Actions** com **NX affected** para buildar apenas o que mudou. Sem NX Cloud - tudo roda direto no CI.

---

## Arquivos Criados

```
.github/workflows/
  ci.yml          # Roda em PRs para main (lint, test, build)
  deploy.yml      # Roda no push/merge para main (versao, build, deploy)

version.json      # Versao atual do projeto (raiz)

apps/frontend/project.json   # Config NX do frontend
apps/backend/project.json    # Config NX do backend
apps/whatsmeow/project.json  # Config NX do whatsmeow (atualizado)
```

---

## Fluxo: Pull Request (ci.yml)

Quando voce abre um PR para `main`:

1. **affected** - Detecta quais apps mudaram usando `nx show projects --affected`
2. **lint-test** - Roda `nx affected -t lint` e `nx affected -t test` apenas nos projetos afetados
3. **build-frontend** - Builda o frontend (apenas se mudou)
4. **build-backend** - Builda o backend (apenas se mudou)
5. **build-meow** - Builda o whatsmeow com Go (apenas se mudou)

Se voce mudar apenas o whatsmeow, **frontend e backend nao buildam**. O NX sabe o que mudou.

---

## Fluxo: Merge para Main (deploy.yml)

Quando um PR e mergeado em `main`:

### 1. Bump de Versao

- Le `version.json` (ex: `1.0.3`)
- Incrementa o patch: `1.0.4`
- Commita o `version.json` atualizado com `[skip ci]` para nao loopear
- Gera o SHA curto do commit (ex: `a1b2c3d`)

### 2. Deteccao de Affected

- Usa `nx show projects --affected` comparando HEAD~1 vs HEAD
- Descobre quais apps mudaram no merge

### 3. Deploy Frontend (se mudou)

- Injeta `VITE_APP_VERSION` no build (ex: `1.0.4`)
- Builda com `nx run @realvidas/frontend:build`
- Envia `apps/frontend/build/` via SCP para o servidor
- A versao aparece no rodape do sidebar: `v1.0.4`

### 4. Deploy Backend (se mudou)

- Builda com NX
- Constroi imagem Docker com 3 tags:
    - `realvidas-backend:latest`
    - `realvidas-backend:1.0.4`
    - `realvidas-backend:a1b2c3d`
- Pusha para GitHub Container Registry (ghcr.io)
- SSH no servidor: pull, install, build backend, migrations TypeORM, restart PM2

### 5. Deploy Whatsmeow (se mudou)

- SSH no servidor: `git pull`, depois **Docker compila o Go** (`docker compose build whatsmeow`)
- Restart: `docker compose up -d --no-deps whatsmeow`
- **Não precisa de Go instalado na VPS** — só Docker
- `npm run build` **não** inclui meow; use `npm run build:meow` se quiser só rebuildar o container

---

## Versionamento

O arquivo `version.json` na raiz controla a versao:

```json
{
    "version": "1.0.4",
    "updatedAt": "2026-06-18T15:30:00.000Z"
}
```

- **Cada merge na main** incrementa o **patch** automaticamente (1.0.0 -> 1.0.1 -> 1.0.2...)
- Para bumpar **minor** ou **major**, edite manualmente o `version.json` antes do merge
- O frontend le essa versao no build e exibe no rodape do sidebar

---

## Tags Docker

Cada imagem Docker recebe 3 tags:

| Tag      | Exemplo                     | Uso                   |
| -------- | --------------------------- | --------------------- |
| `latest` | `realvidas-backend:latest`  | Sempre a mais recente |
| Semver   | `realvidas-backend:1.0.4`   | Versao especifica     |
| SHA      | `realvidas-backend:a1b2c3d` | Commit exato          |

As imagens ficam no GitHub Container Registry:

```
ghcr.io/<seu-usuario>/realvidas-backend:1.0.4
ghcr.io/<seu-usuario>/realvidas-meow:1.0.4
```

---

## NX Affected - Como Funciona

O NX analisa o grafo de dependencias e descobre o que mudou:

```
packages/types  -->  apps/frontend
                -->  apps/backend

apps/whatsmeow  (independente)
```

Exemplos:

- Mudou `packages/types` -> Builda frontend E backend (ambos dependem)
- Mudou `apps/frontend` -> Builda SÓ frontend
- Mudou `apps/whatsmeow` -> Builda SÓ whatsmeow
- Mudou `apps/backend` -> Builda SÓ backend

O NX cache local evita rebuilds desnecessarios mesmo dentro do mesmo workflow.

---

## Secrets Necessarios no GitHub

Vá em **Settings > Secrets and variables > Actions** no seu repo e configure:

| Secret                 | Descricao                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `SERVER_HOST`          | IP ou hostname do servidor VPS                                                              |
| `SERVER_USER`          | Usuario SSH (ex: `root`, `deploy`)                                                          |
| `SERVER_SSH_KEY`       | Chave privada SSH para acesso ao servidor                                                   |
| `FRONTEND_DEPLOY_PATH` | Caminho no servidor para os arquivos do frontend (ex: `/app/realvidas/apps/frontend/build`) |
| `PROJECT_PATH`         | Caminho do projeto no servidor (ex: `/app/realvidas`)                                       |

> `GITHUB_TOKEN` ja vem automaticamente - e usado para push de versao e para o GitHub Container Registry.

---

## Versao no Frontend

A versao aparece no rodape do sidebar. Funciona assim:

1. `vite.config.ts` le `version.json` ou `VITE_APP_VERSION` (env do CI)
2. Injeta como `__APP_VERSION__` no build via `define`
3. O componente `app-sidebar.tsx` renderiza `v{__APP_VERSION__}` no `<SidebarFooter>`

Em dev local, le direto do `version.json`. No CI, usa a env injetada no workflow.

---

## Como Subir Versao Manualmente

Para minor/major, edite `version.json` antes de mergear:

```json
{
    "version": "2.0.0",
    "updatedAt": "2026-06-18T00:00:00.000Z"
}
```

O CI vai incrementar o patch a partir dai: `2.0.0` -> `2.0.1` -> `2.0.2`...

---

## Rodando Localmente

Nada muda no dev local. Os comandos continuam os mesmos:

```bash
npm run dev          # Roda tudo
npm run build        # Builda tudo
npm run build:affected  # Builda apenas o que mudou (vs origin/main)
```
