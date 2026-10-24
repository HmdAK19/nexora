# Security model and production checklist

## Current trust boundaries

- The browser is untrusted. Prices, fees, limits, ownership and balance checks must be repeated by the backend.
- Access tokens live only in JavaScript module memory.
- Refresh tokens belong in `HttpOnly`, `Secure`, appropriately scoped cookies.
- API responses are treated as untrusted input; purchase, conversion and support validate their runtime shapes before storing them.
- React escapes rendered strings. Do not introduce raw HTML from users or APIs.
- The tracked frontend contains no secrets. `.env*` files are ignored except documented examples.

## Authentication

- Access tokens should expire after 15 minutes.
- Refresh tokens should be single-use, rotated and tracked in token families.
- Concurrent frontend refreshes are coalesced to avoid token races.
- Logout clears the cookie server-side and the access token client-side.
- Password reset must always return an account-neutral response.
- Cross-site deployments require explicit CSRF protection in addition to cookie attributes.

## Financial operations

- Never accept browser-computed rates, fees, totals, fills or balances as authoritative.
- Use fixed-precision decimal or integer minor-unit arithmetic, not binary floating point.
- Require an idempotency key for purchases, withdrawals and external settlements.
- Bind idempotency records to user, endpoint and request fingerprint; reject mismatched reuse.
- Execute debit, credit, quote consumption and ledger persistence in one database transaction.
- Do not use optimistic updates for balances or ledger records.
- Use an append-only double-entry ledger and reconcile it with custody/payment providers.

The reference purchase server demonstrates quote ownership, expiration, one-time consumption, balance settlement, safe retry and request rate limiting. Its in-memory repository is not durable and is not suitable for real funds or multi-instance concurrency.

The conversion workflow applies the same trust model: the server owns the rate and fee, verifies the source balance, consumes the quote once and returns the original order for an idempotent retry. Production settlement must replace the synchronous in-memory balance operation with a fixed-precision database/ledger transaction.

Trading orders use server-side market lookup, balance checks, fee calculation, reservation and settlement. Creation is idempotent and mismatched key reuse is rejected. Cancellation is owner-scoped and releases only the reservation recorded on that order. The reference implementation remains synchronous and in-memory; production execution requires transactional row locking, fixed-precision accounting, a double-entry ledger and reconciliation with the matching/liquidity venue.

## Input and output controls

- Validate at UI boundaries for usability and again at API boundaries for security.
- Enforce strict asset/currency allow lists, decimal precision and amount limits.
- Encode URL path parameters.
- Return stable public error codes; log internal context only on the server.
- Avoid displaying arbitrary backend messages for sensitive workflows.
- Limit JSON request size and configure security headers.

## Required production controls

- Durable database with constraints, isolation and tested recovery.
- Audited custody/signing service isolated from the public API.
- KYC/AML, sanctions screening, transaction monitoring and jurisdiction controls.
- MFA/WebAuthn for withdrawals, API keys and security/profile changes.
- Withdrawal allowlists, cooling periods, velocity limits and manual risk review.
- Rate limits for login, refresh, password reset, quote, order, support and administration endpoints.
- Server-side RBAC/ABAC for administration; never authorize from hidden UI alone.
- Secrets manager, key rotation, least-privilege service identities and no development fallback secrets.
- Structured immutable audit logs with redaction, alerting and incident response procedures.
- TLS/HSTS, strict origin policy, CSP, dependency scanning and SAST/DAST.
- Independent application, custody and financial-control audits.

## Data privacy

Profile, identity documents, bank details and support data must be encrypted in transit and at rest, access logged, retention-limited and deleted according to legal policy. The current verification and card screens do not upload or persist sensitive documents/card data to a backend.

Support ticket routes require authentication, scope every read/write by the authenticated owner, validate category and text limits, and rate-limit writes. User-authored text is rendered only through React's escaped text nodes. The reference repository remains in-memory; production support data needs durable encrypted storage, agent RBAC, attachment malware scanning, immutable audit events and retention/deletion enforcement.

## Release security gate

Before a production release: run dependency audit, typecheck, lint, unit/integration/E2E tests, secret scanning and a threat-model review for changed trust boundaries. A successful frontend build is never evidence that money movement is safe.
