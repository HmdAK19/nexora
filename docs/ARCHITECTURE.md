# Architecture

## System boundary

The tracked application is a React single-page frontend. It communicates with a separate HTTP/WebSocket backend through `/api` and `/ws`. The local `server/` directory is a runnable reference implementation, is ignored by Git, and is not the production security boundary.

```text
Browser
  ├─ React UI and routing
  ├─ TanStack Query remote-state cache
  ├─ Redux persisted UI preferences
  ├─ i18next language/direction
  └─ Axios + WebSocket transport
         │
         ├─ /api → authentication, markets, wallet, orders, purchases
         └─ /ws  → live market ticks
```

## Source layout

```text
src/
├── app/          composition, providers, routing, layout, theme and Redux store
├── features/     independently owned business capabilities
│   └── <name>/
│       ├── api/          transport contract and query keys
│       ├── components/   stateless or narrowly stateful feature UI
│       ├── hooks/        orchestration and server-state workflows
│       ├── lib/          pure feature functions
│       ├── locales/      English and Persian resources
│       ├── model/        types, schemas and constants
│       └── pages/        route composition
├── shared/       framework-neutral types, API infrastructure, hooks and UI primitives
└── test/         global Vitest/Testing Library setup
```

Folders are created only when a feature needs that layer. Every folder exposes an `index.ts`; consumers use public barrels instead of deep imports.

## Dependency rules

1. `shared` never imports from `features` or application composition.
2. Features may import `shared`; cross-feature imports must use the target feature’s public API.
3. `app` composes providers and features but does not own feature business rules.
4. Pages coordinate hooks and view components. Network calls do not live in JSX components.
5. Financial authority stays on the server. UI calculations are never accepted as ledger facts.

Import grouping is external packages, blank line, absolute aliases (`@app`, `@features`, `@shared`), blank line, relative imports. Type-only dependencies use `import type`.

## Provider order

`AppProviders` installs providers in this order:

1. i18next
2. language/direction
3. Redux and persistence gate
4. direction-aware Material UI theme
5. TanStack Query
6. authentication

This order lets theme creation consume direction and preferences, and lets authenticated features consume the shared query client.

## State ownership

| State                  | Owner                              | Examples                                            |
| ---------------------- | ---------------------------------- | --------------------------------------------------- |
| Remote server state    | TanStack Query                     | markets, wallet, orders, purchases, support tickets |
| Durable UI preference  | Redux Persist                      | light/dark mode, compact-number preference          |
| Language               | Language provider + local storage  | `fa`/`en`, document direction                       |
| Short-lived form state | React Hook Form or component state | login, order, profile, dialogs                      |
| Access token           | module-memory token store          | bearer token; never local/session storage           |
| Refresh session        | backend HttpOnly cookie            | session restoration and rotation                    |

Default queries are stale for 30 seconds, retained for five minutes, retry at most twice except authentication failures, and do not refetch on focus. Mutations do not retry automatically.

### Form validation boundary

Server-mutating forms use React Hook Form with feature-owned Yup schema factories. Schemas normalize values and enforce field constraints independently of rendering, while localized messages are injected by the UI. Components render accessible field errors and submit only typed, validated values to feature hooks; hooks own async orchestration and never duplicate presentation validation. Domain validators remain reusable for server parity and focused unit tests. The server is always the authoritative validation boundary.

## API and authentication flow

Axios targets `/api`, sends cookies, has a 12-second timeout and attaches the in-memory access token. Initial session restoration and 401 recovery each use a shared single-flight refresh promise, preventing React StrictMode or concurrent requests from rotating the same refresh token twice. The failed request is retried once with the new token; refresh failure clears memory and signals the authentication provider.

Authorization is capability-based. The backend owns the role-to-permission policy and includes a display-safe permission list in login, refresh and current-user responses. Pure frontend predicates, `useAuthorization`, the reusable `Authorized` boundary and `AuthorizedRoute` consume that list for presentation. The application shell filters protected navigation through the same predicate. These client checks improve UX only: the API resolves the current user on each protected request and applies `requirePermission` before the route handler. New privileged routes must declare a permission at composition time and default to denied access when no grant exists.

### Administration module

Administration remains a bounded, lazy-loaded feature inside the existing SPA because it shares the same identity, design system and deployment lifecycle; a separate app or micro-frontend would add release, dependency and cross-app session complexity without a current organizational need. It is not a monolithic tab page. `/admin` owns a nested layout with URL-addressable overview, users, verification, support and settings workspaces. The index route selects the first workspace the operator may access, navigation filters by capability and each child route repeats its own permission boundary.

Each administration resource has a feature-owned API adapter, runtime response validation, deterministic TanStack Query keys and a focused orchestration hook. Remote data never lives in a page-level controller. Mutations reconcile only their resource keys and overview counts. Presentational cards, query states and route layout are reusable without owning business state.

The reference API is the policy enforcement point: authentication is applied to the administration router and an action-specific permission is applied to every endpoint. Services contain workflows, repositories contain persistence, and mutation services append audit events. This division keeps HTTP validation, policy enforcement, orchestration and storage replaceable independently.

Financial purchase responses cross a runtime validation boundary before entering application state. Expand this validation pattern to other high-risk endpoints as the API matures.

Purchase, conversion and support share strict response-field readers at their network boundary. Purchase and conversion also share quote countdown calculation, secure idempotency-key generation and the reusable `DetailRow` presentation primitive. Workflow-specific orchestration remains isolated in each feature hook; support page components receive state and commands from `useSupportCenter` instead of performing transport work.

The reference backend isolates external market transport behind `MarketDataProvider`. Its Binance Spot adapter uses separate schemas for the verbose REST ticker contract and compact WebSocket ticker contract, validates depth/kline/trade payloads and normalizes them into Nexora's provider-neutral shapes. Provider URLs and timeout are environment configuration; upstream failure is surfaced rather than replaced with synthetic prices.

## Cache mutation rules

- Use optimistic updates only for reversible operations such as cancelling an open order.
- Use `createOptimisticHandlers` and `updateInList` from `shared/api/react-query` for consistent snapshot, rollback and invalidation behavior.
- Never optimistically mutate balances, ledger entries, purchases or withdrawals.
- Invalidate the narrowest relevant query keys after confirmed server completion.

## Routing and code splitting

All product pages are loaded with `React.lazy`. `ProtectedRoute` waits for refresh-session restoration before redirecting. The application shell stays mounted while pages change. Vite creates explicit vendor chunks for React, MUI, query/Axios, forms, animation, state, localization, icons and virtualization.

## Performance and offline behavior

- Markets render through `react-virtuoso` and infinite queries.
- Search uses deferred input.
- Charts are SVG/vector primitives without a charting bundle.
- WebSocket reconnection uses a capped exponential delay.
- The PWA shell supports installation.
- Only market read requests use a network-first runtime cache; mutations and authentication are excluded.

## Error and loading model

Pages use shared loaders and feedback blocks for route-level states. Forms keep recoverable input, disable duplicate submissions and expose explicit progress. Financial errors use allow-listed codes so arbitrary server messages are not rendered to users.

## Backend evolution

The reference backend uses in-memory repositories and synchronous services. A production backend must preserve the API contract while replacing repositories with durable, transaction-safe implementations. Purchases must atomically consume a quote, debit fiat, credit the asset and persist the idempotent response.
