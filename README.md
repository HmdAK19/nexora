# Nexora Digital Asset Exchange

Nexora is a bilingual cryptocurrency exchange frontend built from the supplied Cryptolly Figma screenshots. It provides a responsive trading interface and integrates with an API through `/api` and `/ws`.

> This repository is an engineering foundation and working demo. Before handling real funds, replace the in-memory repositories and simulated market feed with audited custody, ledger, KYC/AML, pricing, and order-matching infrastructure.

## Included

- React 19 + TypeScript + Vite, feature-based architecture
- Material UI design system with dark/light themes and RTL/LTR
- TanStack Query, Axios interceptors, optimistic order cancellation
- React Hook Form + Yup typed validation
- Lazy-loaded routes and explicit vendor chunks
- Virtualized, infinite-loading market list
- WebSocket price stream with exponential reconnect
- Redux Toolkit + Redux Persist for durable UI preferences
- i18next Persian and English localization
- Installable PWA with market-data runtime caching
- Short-lived access tokens kept in memory with refresh-cookie support
- Vitest unit and component tests

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Web: `http://localhost:5173`  
Demo account: `demo@nexora.dev` / `Nexora123!`

The dev server proxies `/api` and `/ws` to `http://localhost:4000`. The backend is intentionally maintained in a separate repository and is not tracked here.

## Commands

| Command                 | Purpose                           |
| ----------------------- | --------------------------------- |
| `npm run dev`           | Run the frontend with live reload |
| `npm run build`         | Type-check and build the frontend |
| `npm run typecheck`     | Strict TypeScript checks          |
| `npm run test`          | Unit and component tests          |
| `npm run test:coverage` | Coverage report                   |
| `npm run lint`          | ESLint checks                     |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API contract](docs/API.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Testing strategy](docs/TESTING.md)
- [Security and production checklist](docs/SECURITY.md)
