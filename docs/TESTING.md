# Testing strategy

Nexora uses Vitest and Testing Library. Tests should verify observable behavior and security invariants rather than component internals.

## Current automated coverage

- Formatter behavior.
- Shared optimistic cache update, rollback and invalidation utilities.
- Language persistence and synchronized HTML direction.
- Purchase amount boundaries, precision and quote expiration calculations.
- Conversion amount syntax, precision and range boundaries.
- The ignored reference server has HTTP tests for health, authentication, refresh-cookie issuance, wallet mutation, insufficient balances, idempotent purchase/conversion/trading settlement, trading snapshot/OHLCV contracts, limit-order reservation release, and the support ticket lifecycle.

## Test layers

1. **Pure unit tests:** formatters, validation, calculation, reducers and cache transformations.
2. **Component tests:** forms, dialogs, localization, accessibility names and async states using role/label queries.
3. **API integration tests:** authentication, authorization, ownership, validation, idempotency and transaction behavior.
4. **E2E smoke tests:** login, market navigation, order creation/cancellation, wallet transfer and purchase against staging.
5. **Non-functional tests:** responsive layout, keyboard navigation, accessibility, performance, load, reconnect and security tests.

## Required commands

```bash
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
```

Run targeted tests while developing, then the full gate before delivery. Browser inspection is performed only when explicitly requested by the project owner.

## High-risk scenarios

- Concurrent 401 responses produce only one refresh attempt.
- Refresh failure clears auth and does not loop.
- Retried financial requests preserve idempotency and cannot double debit/credit.
- Quote expiration is enforced by the server, not only the countdown.
- Stale or malformed API responses do not enter financial state.
- Optimistic cancellation rolls back on failure.
- WebSocket disconnect/reconnect does not duplicate subscriptions or accept out-of-order data.
- RTL/LTR changes update document, drawer and layout without reload.
- Amount parsing rejects exponent, hexadecimal, non-finite and excessive-precision input.
- Closed support tickets reject further replies and ticket resources remain owner-scoped.
- Retried market orders cannot settle twice; resting limits reduce available balance and cancellation restores it exactly.

## Missing recommended suites

- MSW-backed component integration tests for all server states.
- Playwright tests at approximately 320, 768, 1024, 1366 and 1920px widths.
- Automated axe accessibility checks.
- Contract tests shared between frontend and backend.
- Ledger property tests, race/concurrency tests and database rollback tests.
- WebSocket sequence-gap and snapshot-reconciliation tests once the production protocol exists.

Every bug fix should add a regression test when the project’s test layer can reproduce it reliably.
