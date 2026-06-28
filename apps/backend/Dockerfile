# Build stage — monorepo root context (see deploy.yml)
FROM node:22.12.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json nx.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/types/package.json ./packages/types/
COPY packages/email-templates/package.json ./packages/email-templates/

RUN npm ci

COPY packages/types ./packages/types
COPY packages/email-templates ./packages/email-templates
COPY apps/backend ./apps/backend

RUN npx nx run @realvidas/types:build \
 && npx nx run @realvidas/email-templates:build \
 && npx nx run @realvidas/backend:build

# Production stage
FROM node:22.12.0-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl netcat-openbsd

ENV NODE_ENV=production

COPY package.json package-lock.json nx.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/types/package.json ./packages/types/
COPY packages/email-templates/package.json ./packages/email-templates/

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/types/dist ./packages/types/dist
COPY --from=builder /app/packages/email-templates/dist ./packages/email-templates/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/src/infra/postgres-databases ./apps/backend/src/infra/postgres-databases

COPY apps/backend/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

WORKDIR /app/apps/backend

EXPOSE 8080

CMD ["/app/entrypoint.sh"]
