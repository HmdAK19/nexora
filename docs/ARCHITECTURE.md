# Architecture

## Boundaries

The frontend follows the reference repository's feature-first layout:

```text
src/
├── app/        providers, router, shell, theme and Redux store
├── features/   auth, dashboard, markets, trade, wallet, orders, settings
├── shared/     API infrastructure, design primitives, formatters and types
└── test/       global test setup
```

Feature modules may import `shared` and application composition. Shared code never imports features. Pages coordinate hooks and stateless view components; network and mutation logic lives in API/hook modules.

## Import rules

1. External packages first.
2. Blank line.
3. Absolute internal aliases in order: `@app`, `@features`, `@shared`.
4. Blank line.
5. Relative sibling imports.
6. Use `import type` when an import has no runtime value.
7. Prefer feature public modules and avoid cross-feature deep imports except an intentional shared workflow (trade creating an order is one such workflow).

## Data ownership

- TanStack Query owns remote state: dashboard, markets, wallet and orders.
- Redux owns only durable client preferences. It must not duplicate server resources.
- React Hook Form owns short-lived form state.
- Component state owns ephemeral presentation state such as tabs and drawers.
- Access tokens stay in module memory. The browser cannot persist them.

## Routing and code splitting

The application shell is stable. Every product page is loaded through `React.lazy`; Vite splits the feature boundary and selected heavy vendor groups. The protected route restores the refresh session before deciding whether to redirect.

## Performance

- Markets use `react-virtuoso`; only visible rows render.
- Infinite queries fetch 25 rows at a time.
- Search uses `useDeferredValue` to keep input responsive.
- Chart elements are vector primitives with no charting runtime.
- WebSocket reconnect uses a capped exponential delay.
- Query stale/gc times avoid duplicate API work.
- PWA market reads use a network-first cache. Auth and order writes are never cached.

## Backend boundary

The backend is maintained in a separate repository. This frontend depends only on the HTTP and WebSocket contracts documented in [API.md](API.md). Production services should provide a transaction-safe ledger, an audited matching engine, custody isolation and idempotent financial operations.
