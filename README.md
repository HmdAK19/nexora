# Nexora Digital Asset Exchange

Nexora is a bilingual, responsive digital-asset exchange application based on the supplied Cryptolly designs. The tracked repository contains the React frontend. A runnable reference API exists under `server/`, but that directory is intentionally ignored because it will become a separate repository.

> Nexora is currently an engineering-grade demo, not a licensed production exchange. The reference server uses in-memory account state; its trade terminal consumes public Binance Spot market data, but orders and balances remain local simulations. Real funds require durable accounting, custody, payment, KYC/AML and operational infrastructure described in the security documentation.

## Current capabilities

- Authentication with in-memory access tokens and HttpOnly refresh-cookie sessions
- Permission-based authorization with guarded navigation/routes and independent API enforcement
- Portfolio dashboard, allocation/performance charts and recent activity
- Paginated and virtualized markets, search, filters and local favorites
- Responsive trade terminal with validated Binance Spot streaming ticks and REST-backed OHLCV/depth, balance-aware idempotent demo orders, chart tools and order management
- Wallet balances, transaction history, deposits and withdrawals
- Server-priced express purchase with expiring quotes and idempotent execution
- Server-priced asset conversion with atomic debit/credit semantics and safe retry
- Permission-scoped administration workspaces for overview, users, verification, support and platform settings
- Server-backed identity-verification drafts, document validation and review submission
- Server-backed bank-card registration with Iranian checksum validation, masking, duplicate prevention, default-card selection and confirmed removal
- Server-backed referral summary, eligibility states, reward totals and native share/clipboard fallbacks
- Schema-based localized validation for financial, identity, support, authentication and profile forms
- Unit, component, MSW contract, axe accessibility and multi-viewport Playwright smoke-test infrastructure
- Persian/English localization with automatic RTL/LTR layout
- Dark/light themes, responsive sidebar and installable PWA

The exact integration status of every screen is documented in [Features](docs/FEATURES.md).

## Technology

React 19, TypeScript, Vite, Material UI, TanStack Query, Axios, React Hook Form, Yup, Redux Toolkit, Redux Persist, i18next, Vitest, Framer Motion and React Virtuoso.

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Expected API/WebSocket server: `http://localhost:4000`

Demo account: `demo@nexora.dev` / `Nexora123!`

The Vite development server proxies `/api` and `/ws` to port `4000`. If the separate backend is not running, authentication and server-backed screens correctly report connection errors.

## Commands

| Command                 | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start the frontend development server    |
| `npm run build`         | Type-check and create a production build |
| `npm run preview`       | Preview the production build             |
| `npm run typecheck`     | Run strict TypeScript checks             |
| `npm run lint`          | Run ESLint with zero warnings allowed    |
| `npm run test`          | Run the unit/component suite once        |
| `npm run test:watch`    | Run tests in watch mode                  |
| `npm run test:coverage` | Generate a coverage report               |
| `npm run format`        | Format the repository with Prettier      |
| `npm run format:check`  | Verify formatting without changing files |

## Documentation

- [Feature catalogue and implementation status](docs/FEATURES.md)
- [Architecture and module boundaries](docs/ARCHITECTURE.md)
- [HTTP and WebSocket API contract](docs/API.md)
- [Design system, responsiveness and accessibility](docs/DESIGN_SYSTEM.md)
- [Security model and production checklist](docs/SECURITY.md)
- [Testing strategy](docs/TESTING.md)
- [Development and contribution guide](docs/DEVELOPMENT.md)
- [Configuration, deployment and operations](docs/OPERATIONS.md)

## Documentation policy

Documentation is part of the implementation. Any change to behavior, routes, API contracts, configuration, security assumptions, architecture or user-facing capabilities must update the relevant document in the same change. A feature is not complete when its documentation is stale.
