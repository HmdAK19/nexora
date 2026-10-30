# Security model and production checklist

## Current trust boundaries

- The browser is untrusted. Prices, fees, limits, ownership and balance checks must be repeated by the backend.
- Access tokens live only in JavaScript module memory.
- Refresh tokens belong in `HttpOnly`, `Secure`, appropriately scoped cookies.
- API responses are treated as untrusted input; purchase, conversion and support validate their runtime shapes before storing them.
- React escapes rendered strings. Do not introduce raw HTML from users or APIs.
- The tracked frontend contains no secrets. `.env*` files are ignored except documented examples.
- Runtime configuration is public input. It accepts only root-relative paths or protocol-allow-listed HTTP/WebSocket URLs, rejects embedded credentials and must never contain secrets.

## Authentication

- Access tokens should expire after 15 minutes.
- Refresh tokens should be single-use, rotated and tracked in token families.
- Concurrent frontend refreshes are coalesced to avoid token races.
- Logout clears the cookie server-side and the access token client-side.
- Password reset must always return an account-neutral response.
- Cross-site deployments require explicit CSRF protection in addition to cookie attributes.

## Authorization

- The backend is authoritative. It resolves the current user for each protected request and evaluates an explicit permission before the route handler runs.
- Authentication failures return `401`; authenticated users without the required grant receive a generic `403` response.
- Role names are not checked throughout UI components. The server owns role-to-permission mapping, while the frontend consumes the returned permission list through shared predicates and reusable route/component boundaries.
- Navigation filtering and guarded React routes are usability controls only and must never replace API enforcement.
- Policies deny access unless a permission is explicitly granted. New privileged actions require a named permission, negative tests and an audit-event design.
- The backend stores users, sessions, roles and audit events durably in PostgreSQL. Production still requires constrained role-change workflows, separation-of-duties approval and an external append-only audit sink.
- Administration permissions are separated by resource and action (`read`, `review`, `reply`, `manage`, and `audit:read`). The administration router authenticates once, while each endpoint acts as its own policy enforcement point.
- `support`, `compliance` and `operations` roles receive only the workspace permissions needed for their duties; `admin` receives the complete administration set. Customer-product navigation and routes also check their product permissions so staff-only accounts are not presented with inaccessible customer workflows.
- Privileged responses expose display-safe summaries only and are runtime-validated again by the frontend. Administration writes are rate-limited and append actor/action/target audit records.
- Production settings changes and high-risk verification decisions should require step-up authentication, optional four-eyes approval and an append-only external audit sink; database persistence alone does not satisfy those controls.

## Financial operations

- Never accept browser-computed rates, fees, totals, fills or balances as authoritative.
- Treat third-party market feeds as untrusted input: validate every payload, enforce timeouts, monitor staleness and stop price-dependent operations when the provider is unavailable.
- Use fixed-precision decimal or integer minor-unit arithmetic, not binary floating point.
- Require an idempotency key for purchases, withdrawals and external settlements.
- Bind idempotency records to user, endpoint and request fingerprint; reject mismatched reuse.
- Execute debit, credit, quote consumption and ledger persistence in one database transaction.
- Do not use optimistic updates for balances or ledger records.
- Use an append-only double-entry ledger and reconcile it with custody/payment providers.

The frontend contract requires quote ownership, expiration, one-time consumption, safe retry and rate limiting. These guarantees must be implemented and verified by the backend; the browser cannot provide ledger atomicity or prevent multi-instance races.

The conversion workflow applies the same trust model: the server owns the rate and fee, verifies the source balance, consumes the quote once and returns the original order for an idempotent retry. Quote consumption, debit, credit and order creation run in one retryable Serializable PostgreSQL transaction using fixed-precision decimals. A double-entry ledger and external-provider reconciliation remain required before financial production use.

Trading orders use server-side market lookup, balance checks, fee calculation, reservation and settlement. Creation is idempotent and mismatched key reuse is rejected. Creation/settlement and cancellation/reservation release each run atomically in retryable Serializable Prisma transactions. Production execution still requires a double-entry ledger, database-backed concurrency tests and reconciliation with the matching/liquidity venue.

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
- Persist encrypted MFA secrets outside process memory and add WebAuthn/step-up enforcement for withdrawals, API keys and security/profile changes.
- Keep email changes behind a separately verified flow. Production avatar handling must decode and re-encode allow-listed images, scan content, strip metadata and store bytes in private object storage rather than process memory or data URLs.
- Notification reads are user-scoped and foreign identifiers are indistinguishable from absent records. Notification action paths are treated as untrusted input and restricted to internal paths before navigation; metadata must remain display-safe and must never contain secrets.
- Withdrawal allowlists, cooling periods, velocity limits and manual risk review.
- Rate limits for login, refresh, password reset, quote, order, support and administration endpoints.
- Server-side RBAC/ABAC for administration; never authorize from hidden UI alone.
- Secrets manager, key rotation, least-privilege service identities and no development fallback secrets.
- Structured immutable audit logs with redaction, alerting and incident response procedures.
- TLS/HSTS, strict origin policy, CSP, dependency scanning and SAST/DAST.
- Independent application, custody and financial-control audits.

## Data privacy

Profile, identity-document bytes, masked bank-card data and support data are persisted in PostgreSQL. They must be encrypted in transit and at rest, access logged, retention-limited and deleted according to legal policy. Raw card and IBAN values are not stored; only masked values and a user-scoped SHA-256 duplicate fingerprint are retained.

Support ticket routes require authentication, scope every read/write by the authenticated owner, validate category and text limits, rate-limit writes and persist tickets/messages in PostgreSQL. User-authored text is rendered only through React's escaped text nodes. Production still needs encryption-at-rest policy, agent RBAC, attachment malware scanning, immutable external audit events and retention/deletion enforcement.

Verification endpoints are owner-scoped and rate-limited. They enforce strict identifier, country, MIME type and 5 MB size boundaries; raw national identifiers are never returned to the browser. Cases become immutable while under review. The reference implementation deliberately discards document bytes and retains metadata only. Production must use direct-to-object-storage uploads with short-lived signed URLs, content sniffing, malware scanning, encryption with separate keys, reviewer RBAC, access audit logs and jurisdiction-specific retention/deletion controls.

Bank-card endpoints are owner-scoped and write-rate-limited. Card and IBAN checksums are validated server-side, raw values are never returned or stored, duplicate detection is isolated by user, and deletion requires an explicit UI confirmation. A hash is not a substitute for provider tokenization or encryption when the input space is enumerable. Production must use a licensed provider for ownership verification/tokenization, keep encryption keys outside the application database, record immutable audit events and avoid logging request bodies.

Referral summaries are owner-scoped and never expose invitee identifiers beyond the display-safe name supplied by the contract. Production attribution tokens must be unguessable, bound once on the server and protected against self-referral, account farming, replay and reward manipulation. Reward eligibility and settlement must be derived from an auditable ledger rather than client input.

## Release security gate

Before a production release: run dependency audit, typecheck, lint, unit/integration/E2E tests, secret scanning and a threat-model review for changed trust boundaries. A successful frontend build is never evidence that money movement is safe.
