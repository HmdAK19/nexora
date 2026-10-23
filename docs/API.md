# API contract

This document describes the contract expected from the separately maintained backend. All endpoints are rooted at `/api`. JSON errors use `{ code, message, details? }`.

## Authentication

| Method | Path                    | Auth   | Purpose                                                                 |
| ------ | ----------------------- | ------ | ----------------------------------------------------------------------- |
| POST   | `/auth/login`           | No     | Verify credentials, return access token, set refresh cookie             |
| POST   | `/auth/refresh`         | Cookie | Rotate refresh token and return a new access token                      |
| POST   | `/auth/logout`          | Cookie | Revoke refresh session and clear cookie                                 |
| POST   | `/auth/forgot-password` | No     | Request password reset instructions without revealing account existence |
| GET    | `/auth/me`              | Bearer | Return current user                                                     |

Access tokens expire after 15 minutes. Refresh tokens expire after seven days and are single-use: a successful refresh invalidates the previous token.

## Product endpoints

| Method | Path                                     | Notes                                         |
| ------ | ---------------------------------------- | --------------------------------------------- |
| GET    | `/dashboard`                             | Portfolio summary, allocation, activities     |
| GET    | `/markets?page=1&pageSize=25&search=btc` | Paginated market directory                    |
| GET    | `/markets/featured`                      | Dashboard market snapshot                     |
| GET    | `/wallet`                                | User balances with USD value                  |
| GET    | `/wallet/transactions`                   | Recent demo deposits and withdrawals          |
| POST   | `/wallet/transfers`                      | Create a validated demo deposit or withdrawal |
| GET    | `/orders`                                | User-owned orders                             |
| POST   | `/orders`                                | Create validated limit/market order           |
| PATCH  | `/orders/:id/cancel`                     | Cancel an owned open order                    |
| GET    | `/health`                                | Service readiness                             |

Wallet transfer payloads use `{ asset, type, amount, network, address? }`. A destination address is required for withdrawals. Demo transfers complete immediately and mutate only the in-memory balance; they never move real assets.

## WebSocket

Connect to `/ws?symbol=BTC-USDT`. The demo feed sends:

```json
{ "symbol": "BTC-USDT", "price": 67842.29, "change24h": 2.47, "timestamp": 1792368000000 }
```

The production protocol should add sequence numbers, heartbeats, subscription messages and snapshot reconciliation.
