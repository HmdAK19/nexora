# Testing strategy

Nexora uses Vitest and Testing Library. Tests should verify observable behavior and security invariants rather than component internals.

## Current automated coverage

- Formatter behavior.
- Shared optimistic cache update, rollback and invalidation utilities.
- Language persistence and synchronized HTML direction.
- Concurrent session-restoration calls are coalesced, while later restoration attempts remain possible after settlement.
- Frontend authorization predicates deny absent/ungranted permissions and accept only explicit grants.
- Reference-server policy tests cover customer/admin grants, and HTTP integration tests verify `403` denial for a customer plus successful administrator access.
- Administration API contract tests accept valid privileged summaries, reject malformed roles before caching and verify encoded resource identifiers.
- Administration settings schema tests cover accepted values and unsafe fee/withdrawal boundaries.
- Reference-server integration tests verify validated settings persistence and actor-attributed audit-event creation.
- Purchase and conversion amount boundaries, precision, quote expiration and safe public-error mapping.
- Trading-chart moving averages and SVG path generation, including missing data points.
- Order-book rendering keeps the nearest buy and sell levels simultaneously visible and excludes overflow depth from the visual window.
- Recent-trade API contract tests accept normalized provider trades and reject malformed side/amount data.
- The reference-server trading integration mocks Binance's distinct REST ticker, depth, kline and recent-trade payloads; the Order Book exposes an explicit retry state instead of silently rendering an empty book after snapshot failure.
- Cryptographically secure idempotency-key generation and fail-closed behavior when the platform API is unavailable.
- Iranian card and IBAN checksum validation, including repeated-digit and invalid-checksum rejection.
- Schema normalization and boundary validation for bank-card registration, support-ticket creation and verification profiles.
- MSW-backed API contract tests reject malformed card responses before they enter application state.
- The bank-card dialog has behavior and automated axe accessibility coverage for invalid and valid submissions.
- Playwright smoke coverage validates login, authenticated navigation and horizontal overflow at 360, 1366 and 1920 pixel widths.
- The ignored reference server has HTTP tests for health, authentication, refresh-cookie issuance, wallet mutation, insufficient balances, idempotent purchase/conversion/trading settlement, provider-normalized trading contracts, limit-order reservation release, support tickets, verification profile/upload/submission locking, masked bank-card registration/duplicate rejection/removal, and referral summary totals/data isolation. Provider HTTP responses are mocked in automated tests; a separate manual connectivity check verifies the public REST and WebSocket endpoints.

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
npm run test:coverage
npm run build
npm run test:e2e
```

Run targeted tests while developing, then the full gate before delivery. `test:e2e` starts the production preview and launches a headless browser, so it is run only when explicitly requested by the project owner. Coverage is scoped to critical domain libraries, optimistic cache behavior, the bank-card API boundary/form and language provider; it enforces minimums of 80% for lines, statements and functions and 70% for branches. Expanding this allow-list requires tests in the same change.

## High-risk scenarios

- Concurrent initial restoration and 401 responses produce only one refresh attempt per active operation.
- Refresh failure clears auth and does not loop.
- A hidden navigation item cannot bypass the server permission check; denied authenticated requests remain `403`.
- Retried financial requests preserve idempotency and cannot double debit/credit.
- Quote expiration is enforced by the server, not only the countdown.
- Stale or malformed API responses do not enter financial state.
- Optimistic cancellation rolls back on failure.
- WebSocket disconnect/reconnect does not duplicate subscriptions or accept out-of-order data.
- RTL/LTR changes update document, drawer and layout without reload.
- Amount parsing rejects exponent, hexadecimal, non-finite and excessive-precision input.
- Closed support tickets reject further replies and ticket resources remain owner-scoped.
- Retried market orders cannot settle twice; resting limits reduce available balance and cancellation restores it exactly.
- Verification responses mask national identifiers and submitted cases reject further profile mutation.

## Missing recommended suites

- Expand MSW-backed component integration tests to every server state and feature.
- Expand Playwright flows beyond authentication to trading, wallet, purchase, conversion, support and verification.
- Expand automated axe checks from the bank-card form to every route and dialog.
- Contract tests shared between frontend and backend.
- Ledger property tests, race/concurrency tests and database rollback tests.
- WebSocket sequence-gap and snapshot-reconciliation tests once the production protocol exists.

Every bug fix should add a regression test when the project’s test layer can reproduce it reliably.
