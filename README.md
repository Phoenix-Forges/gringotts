# Gringotts

Production-grade personal finance aggregation backend built with Node.js, TypeScript, Hapi.js, PostgreSQL, Prisma, Redis, BullMQ, and Docker.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

API docs are available at `http://localhost:3000/documentation`.

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm test
pnpm lint
pnpm format
pnpm worker
pnpm jobs
```

## Services

```bash
docker compose up -d postgres redis
```

Health endpoints:

- `GET /health`
- `GET /ready`

