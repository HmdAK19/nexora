# Feature catalogue

This document is the product-level source of truth for implemented behavior. “Server-backed” means the UI calls the API contract in [API.md](API.md). “Local demo” means behavior exists only in browser memory or local storage and must not be mistaken for a durable production workflow.

## Route map

| Route            | Feature        | Current status | Main behavior                                                                                  |
| ---------------- | -------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| `/login`         | Authentication | Server-backed  | Login, session restoration and password-reset request                                          |
| `/`              | Dashboard      | Server-backed  | Portfolio KPIs, charts, allocation, featured markets and activity                              |
| `/markets`       | Markets        | Server-backed  | Search, infinite pagination, virtualization, quote filters and local favorites                 |
| `/trade/:symbol` | Trade          | Server-backed  | Market snapshot, OHLCV/depth, validated ticker, balance-aware order execution and cancellation |
| `/wallet`        | Wallet         | Server-backed  | Balances, availability, transaction history, deposit and withdrawal                            |
| `/orders`        | Orders         | Server-backed  | Order listing and cancellation                                                                 |
| `/buy-crypto`    | Buy crypto     | Server-backed  | Expiring server quote, confirmation, idempotent purchase and status polling                    |
| `/convert`       | Convert        | Server-backed  | Expiring rate quote, idempotent settlement, status polling and wallet refresh                  |
| `/verification`  | Verification   | Local demo     | Multi-step personal details and document-selection UI; no upload API                           |
| `/cards`         | Bank cards     | Local demo     | Add/remove masked cards in component state                                                     |
| `/referrals`     | Referrals      | Local demo     | Referral-code display/copy and sample statistics                                               |
| `/support`       | Support        | Server-backed  | Create, list, inspect, reply to and close authenticated support tickets                        |
| `/settings`      | Settings       | Mixed          | Profile persisted locally; security actions and notification preferences are demonstrations    |
| `/admin`         | Administration | Local demo     | User search, KYC queue, tickets and financial controls using local sample data                 |

All product routes except `/login` are protected by session restoration. Unknown routes redirect to the dashboard.

## Application shell

- Permanent desktop sidebar and direction-aware mobile drawer.
- Navigation to every product module.
- Global search presentation, notifications menu, theme switcher, language switcher and account menu.
- Sticky top bar and subtle route transition.
- Sidebar anchor changes automatically between left and right for English/Persian.

## Authentication

- Restores a session through the refresh endpoint before rendering protected routes.
- Keeps the short-lived access token only in module memory.
- Sends the refresh cookie with `withCredentials`.
- Coalesces concurrent refresh attempts into one request and retries the original request once.
- Clears authentication and raises `auth:expired` if refresh fails.
- Password-reset UI returns a privacy-preserving result and must not disclose account existence.

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
- Market metadata, OHLCV candles and depth snapshots come from authenticated API contracts and are runtime-validated before rendering.
- Streaming ticks are shape-validated, symbol-bound and rejected when stale; reconnect uses capped backoff.
- Market and marketable limit orders execute at the server-authoritative reference price, charge a server fee and atomically debit/credit reference wallet balances.
- Resting limit orders reserve the required base or quote balance; cancellation releases the exact reservation.
- Creation uses a cryptographically random idempotency key and retains it across uncertain retries. Successful execution refreshes wallet and dashboard state.
- Cancellation uses the shared optimistic React Query utility and rolls back on failure.
- Orders can be filtered between open orders and history.
- The bundled reference market provider derives repeatable snapshots from its in-memory market catalogue. Production deployment must replace it with an exchange/liquidity-provider adapter supplying authoritative trades, candles and sequenced depth; the frontend contract does not need to change.

## Wallet

- Calculates displayed portfolio total from server assets.
- Supports search, balance privacy toggle and asset-specific deposit/withdraw dialogs.
- Validates amount, network and withdrawal address.
- Successful transfers invalidate wallet assets, transactions and dashboard queries.
- The reference server completes demo transfers immediately; production withdrawals require risk, MFA, address and custody workflows.

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
- The reference server verifies ownership, expiration and source balance, consumes the quote once, then debits and credits balances as one synchronous repository operation.
- Production requires a database transaction and fixed-precision ledger; the in-memory reference implementation is not multi-instance safe.

## User-service modules

- Verification: validates basic fields and file selection, but does not transmit files.
- Cards: validates a 16-digit card number and Iranian IBAN format, then keeps only masked display data in memory.
- Referrals: copies a sample referral code to the clipboard.
- Support: lists authenticated tickets, shows full conversations, validates ticket/reply lengths, and supports creation, replies and idempotent closure through the API. Five localized categories and four lifecycle states are represented consistently in Persian and English.
- Settings: profile form uses Yup and local storage; selected photo uses a temporary object URL. MFA, password and session controls are UI demonstrations.
- Administration: sample queues and financial settings demonstrate workflows but do not call privileged APIs. A production admin area must enforce server-side roles and audit all actions.

## Cross-cutting behavior

- Persian and English resources are split by feature namespace.
- Language updates `<html lang>` and `<html dir>` and persists to `localStorage`.
- Theme and number preferences are persisted through Redux Persist.
- PWA caches market GET requests network-first; authentication and financial writes are never runtime-cached.
- Pages are lazy-loaded and heavy libraries have explicit Vite chunks.

## Production gaps

The following are intentionally not claimed as production-complete: durable database state, double-entry ledger, external payment processing, custody, an external matching/liquidity engine, externally sourced market-depth/candle feeds, KYC document storage, MFA/WebAuthn, admin RBAC, staffed support delivery/notifications, card verification and referral settlement.
