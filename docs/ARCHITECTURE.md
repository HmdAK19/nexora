# Architecture

## System boundary

The tracked application is a React single-page frontend. It communicates with the separately maintained [`Nexora API`](https://github.com/HmdAK19/nexora-api) through `/api` and `/ws`. The backend is not part of this repository; its required contract and security responsibilities are documented here so frontend behavior can be reviewed independently.

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

Before application modules are imported, `main.tsx` fetches and validates `runtime-config.json` with browser caching disabled. Only after a valid API and WebSocket configuration is available does it dynamically import `bootstrap.tsx`. This guarantees that singleton transports such as the Axios client are created with the deployment-time configuration. Invalid or unavailable configuration fails closed with a bilingual startup error instead of sending requests to an unintended backend.

`AppProviders` then installs providers in this order:

1. i18next
2. language/direction
3. Redux and persistence gate
4. direction-specific Emotion cache and Material UI theme
5. TanStack Query
6. authentication

This order lets theme creation consume direction and preferences, and lets authenticated features consume the shared query client. The LTR cache applies standard prefixing; the RTL cache additionally mirrors physical rules emitted by MUI and third-party Emotion components. Application-owned layout styles use logical inline/block properties so their spacing remains direction-independent.

## State ownership

| State                  | Owner                              | Examples                                            |
| ---------------------- | ---------------------------------- | --------------------------------------------------- |
| Remote server state    | TanStack Query                     | markets, wallet, orders, purchases, support tickets |
| Durable UI preference  | Redux Persist                      | light/dark mode, compact-number preference          |
| Language               | Language provider + local storage  | English default, `en`/`fa`, document direction      |
| Short-lived form state | React Hook Form or component state | login, order, profile, dialogs                      |
| Access token           | module-memory token store          | bearer token; never local/session storage           |
| Refresh session        | backend HttpOnly cookie            | session restoration and rotation                    |

Default queries are stale for 30 seconds, retained for five minutes, retry at most twice except authentication failures, and do not refetch on focus. Mutations do not retry automatically.

### Form validation boundary

Server-mutating forms use React Hook Form with feature-owned Yup schema factories. Schemas normalize values and enforce field constraints independently of rendering, while localized messages are injected by the UI. Components render accessible field errors and submit only typed, validated values to feature hooks; hooks own async orchestration and never duplicate presentation validation. Domain validators remain reusable for server parity and focused unit tests. The server is always the authoritative validation boundary.

## API and authentication flow

Axios targets the validated runtime `apiBaseUrl`, sends cookies, has a 12-second timeout and attaches the in-memory access token. The market stream resolves `webSocketUrl` against the current origin and converts relative HTTP origins to `ws`/`wss`. Initial session restoration and 401 recovery each use a shared single-flight refresh promise, preventing React StrictMode or concurrent requests from rotating the same refresh token twice. The failed request is retried once with the new token; refresh failure clears memory and signals the authentication provider.

Authorization is capability-based. The backend owns the role-to-permission policy and includes a display-safe permission list in login, refresh and current-user responses. Pure frontend predicates, `useAuthorization`, the reusable `Authorized` boundary and `AuthorizedRoute` consume that list for presentation. The application shell filters protected navigation through the same predicate. These client checks improve UX only: the API resolves the current user on each protected request and applies `requirePermission` before the route handler. New privileged routes must declare a permission at composition time and default to denied access when no grant exists.

### Administration module

Administration remains a bounded, lazy-loaded feature inside the existing SPA because it shares the same identity, design system and deployment lifecycle; a separate app or micro-frontend would add release, dependency and cross-app session complexity without a current organizational need. It is not a monolithic tab page. `/admin` owns a nested layout with URL-addressable overview, users, verification, support and settings workspaces. The index route selects the first workspace the operator may access, navigation filters by capability and each child route repeats its own permission boundary.

Each administration resource has a feature-owned API adapter, runtime response validation, deterministic TanStack Query keys and a focused orchestration hook. Remote data never lives in a page-level controller. Mutations reconcile only their resource keys and overview counts. Presentational cards, query states and route layout are reusable without owning business state.

The backend must be the policy-enforcement point: authentication applies to the administration router and an action-specific permission applies to every endpoint. A recommended backend design separates HTTP validation, authorization policy, workflow services, persistence and audit-event delivery so each can evolve and be tested independently.

Financial purchase responses cross a runtime validation boundary before entering application state. Expand this validation pattern to other high-risk endpoints as the API matures.

Purchase, conversion and support share strict response-field readers at their network boundary. Purchase and conversion also share quote countdown calculation, secure idempotency-key generation and the reusable `DetailRow` presentation primitive. Workflow-specific orchestration remains isolated in each feature hook; support page components receive state and commands from `useSupportCenter` instead of performing transport work.

The frontend consumes provider-neutral market shapes. A compatible backend should isolate external market transport behind a provider adapter, validate ticker, depth, candle and trade payloads, and normalize them before delivery. Upstream failure must be surfaced explicitly rather than replaced with synthetic prices.

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

Route and query loading states use shared, composable skeleton primitives matched to the expected dashboard, table, card-grid or form layout. Features can combine lower-level skeleton rows, headings and statistic cards for local incremental loading without duplicating markup. Short mutations retain progress indicators inside the initiating control so context and layout remain stable. Forms keep recoverable input, disable duplicate submissions and expose explicit progress. Financial errors use allow-listed codes so arbitrary server messages are not rendered to users.

## Backend requirements

A production backend must preserve the documented contract while using durable, transaction-safe persistence. Purchases and conversions must atomically consume a quote, record balanced ledger entries and persist the idempotent response. Order, wallet, verification and administration workflows require ownership checks, auditable state transitions and concurrency-safe storage.
