# Testing strategy

The frontend suite uses Vitest and Testing Library.

## Pyramid

1. Pure utilities and optimistic cache transforms: fast unit tests.
2. Forms and feature behavior: component tests queried by role/label.
3. Recommended production gate: Playwright smoke tests against the built application and real staging API.

Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` before merging.

High-risk frontend additions should cover concurrent mutations, decimal formatting, WebSocket sequence gaps, locale direction changes and offline-update behavior. Authentication, ledger and API security tests belong in the backend repository.
