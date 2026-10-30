# Feature catalogue

This document is the product-level source of truth for implemented frontend behavior. “Frontend-integrated” means the UI implements and consumes the contract in [API.md](API.md); it does not assert that a production backend is included in this repository. “Local-only” means state remains in browser memory or local storage.

## Route map

| Route            | Feature        | Current status      | Main behavior                                                                    |
| ---------------- | -------------- | ------------------- | -------------------------------------------------------------------------------- |
| `/login`         | Authentication | Frontend-integrated | Login, demo accounts, session restoration and password-reset request             |
| `/register`      | Authentication | Frontend-integrated | Validated customer registration and immediate authenticated session              |
| `/`              | Dashboard      | Frontend-integrated | Portfolio KPIs, charts, allocation, featured markets and activity                |
| `/markets`       | Markets        | Frontend-integrated | Search, infinite pagination, virtualization, quote filters and local favorites   |
| `/trade/:symbol` | Trade          | Frontend-integrated | Market snapshot, OHLCV/depth, validated ticker, order execution and cancellation |
| `/wallet`        | Wallet         | Frontend-integrated | Balances, availability, transaction history, deposit and withdrawal              |
| `/orders`        | Orders         | Frontend-integrated | Order listing and cancellation                                                   |
| `/buy-crypto`    | Buy crypto     | Frontend-integrated | Expiring server quote, confirmation, idempotent purchase and status polling      |
| `/convert`       | Convert        | Frontend-integrated | Expiring rate quote, idempotent settlement, status polling and wallet refresh    |
| `/verification`  | Verification   | Frontend-integrated | Profile draft, validated document upload, review submission and persisted status |
| `/cards`         | Bank cards     | Frontend-integrated | Validated registration, masked listing, default selection and removal            |
| `/referrals`     | Referrals      | Frontend-integrated | Code, share fallback, aggregate metrics, eligibility states and reward activity  |
| `/support`       | Support        | Frontend-integrated | Create, list, inspect, reply to and close authenticated support tickets          |
| `/settings`      | Settings       | Frontend-integrated | Persisted profile, avatar, preferences, password, sessions and TOTP flows        |
| `/admin/*`       | Administration | Frontend-integrated | Permission-scoped overview, users, verification, support and platform settings   |

All product routes except `/login` and `/register` are protected by session restoration. Unknown routes redirect to the dashboard.

## Application shell

- Permanent desktop sidebar and direction-aware mobile drawer.
- Navigation to every product module.
- Global search presentation, server-backed notification menu, theme switcher, an always-visible top-bar language switcher and account menu.
- Notifications expose loading, empty, error/retry and unread states; individual and bulk read actions use optimistic cache updates with rollback.
- Sticky top bar and subtle route transition.
- Sidebar anchor changes automatically between left and right for English/Persian.

## Authentication

- Restores a session through the refresh endpoint before rendering protected routes.
- Keeps the short-lived access token only in module memory.
- Sends the refresh cookie with `withCredentials`.
- Coalesces concurrent refresh attempts into one request and retries the original request once.
- Clears authentication and raises `auth:expired` if refresh fails.
- Password-reset UI returns a privacy-preserving result and must not disclose account existence.
- Registration validates bilingual names, normalized email, optional E.164 phone, strong password confirmation and terms acceptance before creating a basic customer account. A successful response establishes the access/refresh session immediately; duplicate email and rate-limit errors remain explicit and localized.
- Login and registration submit actions remain disabled until their current client-side requirements are valid; MFA login additionally requires a complete authenticator or recovery code.
- Login, refresh and current-user responses include a role plus explicit permissions. Navigation and routes use permissions rather than hard-coded role-name checks.
- Every `/admin/*` workspace has an action-specific read permission; unauthorized authenticated users are sent to the localized forbidden page. A compatible API must independently return `403` for denied access.
- Limited `support`, `compliance` and `operations` operators enter their first permitted workspace; administration navigation and customer-product navigation are both derived from explicit permissions.

## Dashboard and markets

- Dashboard queries overview and featured-market resources independently.
- Explicit loading, retry and error states.
- Markets fetch 25 rows per page and load more at the end of the virtual list.
- Search is deferred so typing remains responsive.
- Favorites are stored locally; they are not synchronized to a user account.
- Market WebSocket reconnects with capped backoff. Production feeds still need sequencing, heartbeats and snapshot reconciliation.

## Trade and orders

- Route symbol controls the selected market.
- Supports buy/sell and limit/market forms with validation.
- Market metadata, OHLCV candles and depth snapshots come from authenticated API contracts backed by Binance Spot public market data and are runtime-validated before rendering.
- Streaming ticks are shape-validated, symbol-bound and rejected when stale; reconnect uses capped backoff.
- The desktop terminal matches the reference hierarchy with Order Book on the left, chart and order entry in the center, and a navigable market list plus provider-backed recent trades on the right. Narrow layouts stack the same functional panels.
- Market and marketable limit orders execute at the server-authoritative reference price, charge a server fee and atomically debit/credit reference wallet balances.
- Resting limit orders reserve the required base or quote balance; cancellation releases the exact reservation.
- Creation uses a cryptographically random idempotency key and retains it across uncertain retries. Successful execution refreshes wallet and dashboard state.
- Cancellation uses the shared optimistic React Query utility and rolls back on failure.
- Orders can be filtered between open orders and history.
- The frontend contract expects provider-normalized ticker, candle, depth and recent-trade data. Production order execution must be implemented by an authoritative backend and must never be inferred from public market-data responses.

## Wallet

- Calculates displayed portfolio total from server assets.
- Supports search, balance privacy toggle and asset-specific deposit/withdraw dialogs.
- Validates amount, network and withdrawal address.
- Successful transfers invalidate wallet assets, transactions and dashboard queries.
- Production withdrawals require authoritative balance checks, idempotency, risk screening, MFA, address policy and custody workflows.

## Express purchase

- Accepts USD amounts from `10.00` to `50,000.00` with at most two decimal places.
- Supports BTC, ETH and USDT.
- Requests a short-lived server quote; the browser never supplies authoritative rate, fee or received quantity.
- Shows unit price, fee, total, received amount and a live expiration countdown.
- Generates a cryptographically random idempotency key for execution.
- Retains that key after an uncertain network failure so retry cannot duplicate the purchase.
- Polls pending orders every two seconds and refreshes dashboard, order and wallet caches only after a terminal state.
- Validates response shapes at runtime and exposes only allow-listed public error codes.
- P2P offer cards currently navigate to the trade terminal; they are not a full escrow marketplace.
- Bank-deposit details are informational and static.

## Asset conversion

- Supports BTC, ETH, USDT and SOL with automatic source/destination swapping.
- Accepts positive amounts with up to eight decimal places and rejects exponent/hexadecimal input.
- Requests a short-lived server quote containing the authoritative rate, source-denominated fee and destination amount.
- Executes only the opaque quote ID with a cryptographically random idempotency key.
- Preserves the key after uncertain failures, polls pending conversions every two seconds and refreshes wallet/dashboard data only after a terminal state.
- Validates every quote/order response at the network boundary before it enters application state.
- A compatible backend must verify ownership, expiration and source balance, then consume the quote and record both sides of the conversion atomically.
- Production requires a database transaction and fixed-precision double-entry ledger.

## User-service modules

- Verification: uses localized field-level schema validation, saves an authenticated profile draft, uploads a PDF/JPEG/PNG document with 5 MB enforcement, submits a complete case once and renders persisted draft/pending/verified states. Sensitive national identifiers are masked in every response.
- Cards: uses normalized schema validation plus Iranian card and IBAN checksums on both client and server, keeps only masked values plus a user-scoped duplicate fingerprint, supports default-card selection and requires confirmation before removal. External ownership verification remains a production integration.
- Referrals: loads an authenticated summary, supports native sharing with clipboard fallback, and presents responsive aggregate metrics plus joined/qualified/rewarded activity. The reference data is deterministic; signup attribution and monetary settlement remain production integrations.
- Support: lists authenticated tickets, shows full conversations, provides localized schema errors for ticket fields and reply boundaries, and supports creation, replies and idempotent closure through the API. Five localized categories and four lifecycle states are represented consistently in Persian and English.
- Settings: profile and preference state is authenticated and server-backed. The profile form uses Yup, keeps email read-only pending a verified change flow, validates PNG/JPEG/WebP avatars at 1 MB on both sides of the boundary and refreshes shell identity after name changes. Language, theme and notification preferences share one runtime-validated record. Password changes, active-session inspection/revocation and TOTP setup/confirmation/disable expose explicit loading/error states. Recovery codes are shown once and can satisfy the MFA login challenge once each.
- Administration: nested URL-addressable workspaces consume overview metrics, searchable user summaries, pending verification cases, support tickets and platform settings. Review, reply and settings mutations use separate permissions and focused cache invalidation. Production requires server validation, rate limiting, durable transactional repositories, immutable centralized audit storage and step-up authentication for high-risk controls.

## Cross-cutting behavior

- Persian and English resources are split by feature namespace.
- The authenticated preference record synchronizes language, theme and notification choices; language still updates `<html lang>` and `<html dir>` and local persistence provides startup continuity.
- Redux Persist provides startup continuity for theme state until the authenticated preference query becomes authoritative.
- PWA caches market GET requests network-first; authentication and financial writes are never runtime-cached.
- API and WebSocket endpoints load from an uncached, validated runtime file, allowing backend changes without rebuilding the frontend artifact.
- Pages are lazy-loaded and heavy libraries have explicit Vite chunks.

## Production gaps

The backend now provides Prisma/PostgreSQL persistence for profiles, avatars, notifications, sessions, MFA, wallets, orders, KYC documents, support, cards, referrals, settings and audit events. Purchase, conversion, trade/reservation, cancellation/release and reference-wallet transfers use retryable Serializable transactions. The following are intentionally not claimed as production-complete: verified email change, notification delivery workers and realtime push, a double-entry ledger, external payment processing, custody, an external matching/liquidity engine, KYC reviewer/provider integration, envelope encryption for MFA/KYC secrets, WebAuthn, four-eyes administration workflows, an external append-only audit sink, staffed support delivery, card ownership verification/tokenization and referral attribution/fraud controls.
