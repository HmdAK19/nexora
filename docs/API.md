# API contract

This document describes the contract expected from the separately maintained backend. All endpoints are rooted at `/api`. JSON errors use `{ code, message, details? }`.

## Conventions

- Requests and responses use `application/json` except future document uploads.
- Protected endpoints require `Authorization: Bearer <access-token>`.
- Timestamps use ISO 8601 UTC strings.
- Monetary and asset quantities are JSON numbers in the current contract. Production persistence and calculations must use fixed-precision decimals or integer minor units.
- Resource IDs are opaque strings. Clients must not infer meaning from their format.
- `400` indicates validation failure, `401` invalid/expired authentication, `403` denied policy, `404` absent or inaccessible owned resource, `409` conflicting state, `410` expired quote, `422` rejected business rule and `429` rate limiting.
- Validation errors may include field details; sensitive policy errors should remain generic.

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": { "amount": "Must be positive" }
}
```

## Authentication

| Method | Path                    | Auth   | Purpose                                                                 |
| ------ | ----------------------- | ------ | ----------------------------------------------------------------------- |
| POST   | `/auth/login`           | No     | Verify credentials, return access token, set refresh cookie             |
| POST   | `/auth/refresh`         | Cookie | Rotate refresh token and return a new access token                      |
| POST   | `/auth/logout`          | Cookie | Revoke refresh session and clear cookie                                 |
| POST   | `/auth/forgot-password` | No     | Request password reset instructions without revealing account existence |
| GET    | `/auth/me`              | Bearer | Return current user                                                     |

Access tokens expire after 15 minutes. Refresh tokens expire after seven days and are single-use: a successful refresh invalidates the previous token.

### Authentication payloads

Login request:

```json
{ "email": "demo@nexora.dev", "password": "Nexora123!" }
```

Login and refresh response:

```json
{
  "accessToken": "eyJ...",
  "user": {
    "id": "user-demo",
    "name": "Hamed Akbarzadeh",
    "email": "demo@nexora.dev",
    "level": "verified"
  }
}
```

`POST /auth/forgot-password` accepts `{ "email": "user@example.com" }` and should return `204` for both existing and absent accounts. `POST /auth/logout` returns `204`. `GET /auth/me` returns only the `user` object.

## Product endpoints

| Method | Path                                     | Notes                                         |
| ------ | ---------------------------------------- | --------------------------------------------- |
| GET    | `/dashboard`                             | Portfolio summary, allocation, activities     |
| GET    | `/markets?page=1&pageSize=25&search=btc` | Paginated market directory                    |
| GET    | `/markets/featured`                      | Dashboard market snapshot                     |
| GET    | `/markets/:symbol/trading`               | Trading metadata and sequenced depth snapshot |
| GET    | `/markets/:symbol/candles`               | Timeframe-based OHLCV candle history          |
| GET    | `/wallet`                                | User balances with USD value                  |
| GET    | `/wallet/transactions`                   | Recent demo deposits and withdrawals          |
| POST   | `/wallet/transfers`                      | Create a validated demo deposit or withdrawal |
| GET    | `/orders`                                | User-owned orders                             |
| POST   | `/orders`                                | Create validated limit/market order           |
| PATCH  | `/orders/:id/cancel`                     | Cancel an owned open order                    |
| POST   | `/buy/quotes`                            | Create a short-lived, server-priced quote     |
| POST   | `/buy/orders`                            | Execute a quote as an idempotent purchase     |
| GET    | `/buy/orders/:id`                        | Read a user-owned purchase status             |
| POST   | `/convert/quotes`                        | Create a short-lived asset-conversion quote   |
| POST   | `/convert/orders`                        | Execute a conversion quote idempotently       |
| GET    | `/convert/orders/:id`                    | Read a user-owned conversion status           |
| GET    | `/support/tickets`                       | List authenticated user's support tickets     |
| POST   | `/support/tickets`                       | Create a support ticket and first message     |
| GET    | `/support/tickets/:id`                   | Read an owned ticket conversation             |
| POST   | `/support/tickets/:id/messages`          | Add a user reply to an open owned ticket      |
| PATCH  | `/support/tickets/:id/close`             | Close an owned ticket                         |
| GET    | `/health`                                | Service readiness                             |

Wallet transfer payloads use `{ asset, type, amount, network, address? }`. A destination address is required for withdrawals. Demo transfers complete immediately and mutate only the in-memory balance; they never move real assets.

## Resource shapes

### Dashboard

`GET /dashboard` returns:

```json
{
  "portfolioValue": 128450.25,
  "portfolioChange": 2.8,
  "availableBalance": 24320.5,
  "openOrders": 3,
  "totalTrades": 184,
  "allocation": [{ "symbol": "BTC", "value": 58, "color": "#f7931a" }],
  "performance": [102000, 103500, 104200],
  "activities": [
    {
      "id": "activity-1",
      "title": "Bought BTC",
      "subtitle": "BTC/USDT",
      "amount": -1000,
      "kind": "buy"
    }
  ]
}
```

`kind` is `buy`, `sell` or `deposit`. Allocation and performance arrays may be empty but must be present.

### Markets

Market resources use:

```json
{
  "id": "btc",
  "symbol": "BTC",
  "name": "Bitcoin",
  "quote": "USDT",
  "price": 67842.29,
  "change24h": 2.47,
  "volume24h": 1820000000,
  "sparkline": [66000, 66500, 67842.29]
}
```

`GET /markets` accepts positive `page`, `pageSize` up to the backend limit, and a case-insensitive `search`. It returns:

```json
{ "data": [], "page": 1, "pageSize": 25, "total": 0, "hasMore": false }
```

`GET /markets/featured` returns a plain market array.

`GET /markets/:symbol/trading` returns `baseAsset`, `quoteAsset`, display name, last/high/low prices, 24-hour change/volume and a depth object containing `symbol`, monotonic `sequence`, `asks` and `bids`. Each level has positive `price` and `amount` fields. `GET /markets/:symbol/candles?timeframe=15m&limit=110` accepts `1m`, `5m`, `15m`, `1h`, `4h` or `1D` and returns chronological `{ time, open, high, low, close, volume }` values. Limits are constrained to 28–500.

### Wallet

`GET /wallet` returns market fields plus:

```json
{ "balance": 0.8421, "available": 0.7747, "value": 57134.2 }
```

`GET /wallet/transactions` returns newest first:

```json
{
  "id": "tx-101",
  "asset": "USDT",
  "type": "deposit",
  "amount": 5000,
  "network": "TRC20",
  "status": "completed",
  "createdAt": "2026-10-16T12:00:00.000Z"
}
```

Withdrawal transactions also include `address`. `POST /wallet/transfers` accepts the transaction fields except `id`, `status` and `createdAt`, and returns the created transaction. The backend must verify asset/network compatibility, address format, available balance, ownership/risk policy and idempotency in production.

### Trading orders

Order resources use:

```json
{
  "id": "ord-101",
  "symbol": "BTC-USDT",
  "side": "buy",
  "type": "limit",
  "price": 67500,
  "amount": 0.02,
  "filled": 0,
  "status": "open",
  "createdAt": "2026-10-23T12:00:00.000Z"
}
```

`POST /orders` accepts `{ symbol, side, type, price, amount }` and requires a random 16–128 character `Idempotency-Key`. `side` is `buy` or `sell`; `type` is `limit` or `market`. The response also includes `averagePrice`, `quoteAmount`, `feeAmount` and `updatedAt`. Marketable orders settle balances immediately. Resting limits reserve the necessary quote balance for buys or base balance for sells. `GET /orders` returns only the authenticated user’s orders, newest first. `PATCH /orders/:id/cancel` may cancel only an owned `open` order, releases its reservation and returns the updated resource.

Recommended public order errors are `ORDER_NOT_FOUND`, `ORDER_NOT_OPEN`, `INSUFFICIENT_BALANCE`, `IDEMPOTENCY_KEY_REUSED`, `MARKET_NOT_FOUND` and `RATE_LIMITED`.

## WebSocket

Connect to `/ws?symbol=BTC-USDT`. The demo feed sends:

```json
{ "symbol": "BTC-USDT", "price": 67842.29, "change24h": 2.47, "timestamp": 1792368000000 }
```

The production protocol should add sequence numbers, heartbeats, subscription messages and snapshot reconciliation.

The client expects the WebSocket endpoint on the same public origin. In development Vite proxies `/ws` to the reference server. Production messages should include a monotonically increasing sequence and subscription acknowledgement before the frontend treats the stream as authoritative.

## Express purchase

The frontend never calculates or submits an authoritative price, fee, total or asset amount. Those values are issued and signed or stored by the backend in a short-lived quote.

### Create quote

`POST /buy/quotes` requires bearer authentication.

```json
{ "asset": "BTC", "fiatAmount": 1000, "fiatCurrency": "USD" }
```

The server returns:

```json
{
  "id": "quote_01J...",
  "asset": "BTC",
  "assetAmount": 0.0145,
  "fiatAmount": 1000,
  "fiatCurrency": "USD",
  "unitPrice": 68124,
  "feeAmount": 5,
  "totalAmount": 1005,
  "expiresAt": "2026-10-23T12:00:20.000Z"
}
```

Quotes should expire within 15–30 seconds and be bound to the authenticated user, asset, currency and requested amount.

### Execute quote

`POST /buy/orders` requires bearer authentication and a cryptographically random `Idempotency-Key` header.

```json
{ "quoteId": "quote_01J..." }
```

The response is the existing or newly-created order for that user and idempotency key:

```json
{
  "id": "purchase_01J...",
  "asset": "BTC",
  "assetAmount": 0.0145,
  "fiatAmount": 1000,
  "fiatCurrency": "USD",
  "status": "pending",
  "createdAt": "2026-10-23T12:00:10.000Z"
}
```

`GET /buy/orders/:id` returns the same shape with `status` equal to `pending`, `completed` or `failed`. Failed orders may include a stable `failureCode`.

The backend implementation must:

- enforce authentication, authorization and ownership on every quote and order;
- validate supported assets, currencies, decimal precision, minimum and maximum amounts;
- re-check quote expiry, account restrictions, KYC/AML/risk rules and available balance;
- use decimal or integer minor-unit arithmetic, never binary floating point for ledger values;
- consume a quote at most once and execute balance/ledger changes in one database transaction;
- persist the idempotency key with a request fingerprint and return the original response on safe retries;
- reject reuse of an idempotency key with a different payload;
- rate-limit quote/order creation and record an immutable audit trail without logging secrets;
- return generic public errors such as `QUOTE_EXPIRED`, `QUOTE_NOT_FOUND`, `INSUFFICIENT_BALANCE`, `LIMIT_EXCEEDED` and `PURCHASE_BLOCKED`.

The client deliberately performs no optimistic wallet update. Wallet, dashboard and order queries are refreshed only after the backend reports a terminal order state.

## Asset conversion

The client submits asset symbols and a source quantity but never submits an authoritative rate, fee or destination quantity.

`POST /convert/quotes` requires bearer authentication:

```json
{ "fromAsset": "USDT", "sourceAmount": 100, "toAsset": "ETH" }
```

The response is valid for a short period:

```json
{
  "id": "31dfa5e9-5598-4590-9a57-58ee59dc7a44",
  "fromAsset": "USDT",
  "toAsset": "ETH",
  "sourceAmount": 100,
  "destinationAmount": 0.02816,
  "rate": 0.0002819,
  "feeAmount": 0.1,
  "expiresAt": "2026-10-24T12:00:20.000Z"
}
```

`POST /convert/orders` requires bearer authentication and a random `Idempotency-Key` header:

```json
{ "quoteId": "31dfa5e9-5598-4590-9a57-58ee59dc7a44" }
```

It returns the original response for a safe retry with the same user, key and quote:

```json
{
  "id": "a72f9e2f-eb9f-459c-8119-225976c43e94",
  "fromAsset": "USDT",
  "toAsset": "ETH",
  "sourceAmount": 100,
  "destinationAmount": 0.02816,
  "status": "completed",
  "createdAt": "2026-10-24T12:00:10.000Z"
}
```

`GET /convert/orders/:id` returns the same order shape. The backend must reject identical source/destination assets, unsupported pairs, expired/consumed quotes, insufficient available balance and idempotency-key reuse with another quote. Debit, fee recognition, credit and order creation belong in one fixed-precision database transaction.

Recommended public errors are `QUOTE_EXPIRED`, `QUOTE_NOT_FOUND`, `INSUFFICIENT_BALANCE`, `AMOUNT_TOO_SMALL`, `CONVERSION_BLOCKED` and `RATE_LIMITED`.

## Support tickets

Every support route requires bearer authentication and scopes ticket access to the current user. `POST /support/tickets` accepts a subject of 4–120 characters, a message of 10–4,000 characters and one of `account`, `wallet`, `trading`, `verification` or `security`:

```json
{
  "subject": "Missing wallet deposit",
  "category": "wallet",
  "message": "My deposit has not appeared in my wallet yet."
}
```

List responses contain summaries ordered by most recently updated. Detail and mutation responses also contain the chronological conversation:

```json
{
  "id": "2bb508de-a0bb-4aec-8383-a58048efed84",
  "subject": "Missing wallet deposit",
  "category": "wallet",
  "status": "waiting_for_support",
  "createdAt": "2026-10-24T12:00:00.000Z",
  "updatedAt": "2026-10-24T12:00:00.000Z",
  "lastMessagePreview": "My deposit has not appeared in my wallet yet.",
  "messages": [
    {
      "id": "e47cd41f-d182-4ca0-a7fd-f1851196d8d1",
      "author": "user",
      "body": "My deposit has not appeared in my wallet yet.",
      "createdAt": "2026-10-24T12:00:00.000Z"
    }
  ]
}
```

Statuses are `open`, `waiting_for_support`, `waiting_for_user` and `closed`. `POST /support/tickets/:id/messages` accepts `{ "message": "..." }`; a user reply moves an active ticket to `waiting_for_support`. Closing is idempotent. Further replies return `TICKET_CLOSED`; missing and non-owned resources both return `TICKET_NOT_FOUND` to avoid disclosing existence. Writes are rate-limited. The reference server does not implement the support-agent side or external notifications.

## Cache consequences

| Successful mutation | Frontend cache action                                              |
| ------------------- | ------------------------------------------------------------------ |
| Login/refresh       | Update in-memory token and authenticated user                      |
| Logout              | Clear token and protected session state                            |
| Create order        | Insert returned order into order list                              |
| Cancel order        | Optimistically mark cancelled, rollback on failure, then reconcile |
| Execute order       | Insert order; invalidate wallet and dashboard after server result  |
| Wallet transfer     | Invalidate wallet assets, transactions and dashboard               |
| Terminal purchase   | Invalidate wallet, dashboard and order families                    |
| Terminal conversion | Invalidate wallet and dashboard families                           |
| Support mutation    | Invalidate ticket list and the affected ticket detail              |

## Contract evolution

Breaking changes require a versioned endpoint or coordinated frontend release. Additive fields are allowed, but existing required fields and enum values must remain valid. Financial endpoints should publish machine-readable schemas and be covered by shared contract tests.
