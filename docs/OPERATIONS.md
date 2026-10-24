# Configuration, deployment and operations

## Runtime topology

The frontend is a static SPA. In development, Vite serves it on port `5173` and proxies API/WebSocket traffic to `http://localhost:4000`. In production, a reverse proxy or gateway should serve the static build and route `/api` and `/ws` to backend services on the same public origin.

```text
https://exchange.example
  ├─ /assets/*, /index.html → static frontend/CDN
  ├─ /api/*                → HTTP API
  └─ /ws                   → WebSocket market gateway
```

Same-origin deployment simplifies cookies, CORS and WebSocket configuration. If origins differ, explicitly configure CORS, credentials, cookie domain/SameSite and CSRF controls.

## Frontend configuration

The current frontend has no required build-time environment variables. Development routing is configured in `vite.config.ts`:

- frontend port: `5173`
- API target: `http://localhost:4000`
- WebSocket target: `ws://localhost:4000`
- build target: ES2022
- source maps: enabled

If targets become configurable, expose only non-secret `VITE_*` values. Never put private API keys, token secrets or provider credentials into a Vite environment variable because they are embedded in browser code.

## Reference server configuration

When the ignored local `server/` workspace is present, it expects:

| Variable               | Purpose                    | Development default       |
| ---------------------- | -------------------------- | ------------------------- |
| `PORT`                 | HTTP/WebSocket port        | `4000`                    |
| `CLIENT_ORIGIN`        | Allowed browser origin     | `http://localhost:5173`   |
| `ACCESS_TOKEN_SECRET`  | Access JWT signing secret  | development fallback only |
| `REFRESH_TOKEN_SECRET` | Refresh JWT signing secret | development fallback only |
| `NODE_ENV`             | Runtime mode               | `development`             |

Production must fail startup when secrets are absent and must load them from a secrets manager. The reference server’s in-memory data resets on process restart.

If available locally:

```bash
cd server
npm install
npm run build
npm test
npm run dev
```

The server directory remains ignored and must be published independently when it becomes its own repository.

## Build and artifact

```bash
npm ci
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
```

Deploy the generated `dist/` directory. Configure the host to fall back unknown non-API routes to `index.html`; otherwise direct navigation to routes such as `/wallet` will return 404.

Production source maps help error diagnosis but may expose source. Upload them privately to the monitoring service or restrict public delivery according to deployment policy.

## PWA behavior

- Manifest name: Nexora Digital Asset Exchange.
- Display mode: standalone.
- Navigation fallback: `/index.html`.
- Service-worker updates use prompt registration.
- Market API reads use a three-second network-first strategy.
- Authentication, wallet, order and purchase mutations are not cached.

Changing API caching requires a security and stale-data review. Never add financial writes or authenticated private responses to a shared cache.

## Reverse proxy requirements

- Preserve WebSocket upgrade headers for `/ws`.
- Forward the actual client IP through a trusted proxy chain so rate limits are meaningful.
- Set request-size and timeout limits appropriate to each endpoint.
- Terminate TLS and enable HSTS in production.
- Do not cache authenticated `/api` responses unless the endpoint explicitly defines a private caching policy.
- Return `index.html` only for frontend navigation, never as a fallback for missing `/api` paths.

## Observability

Production services should emit structured logs with request/correlation IDs while redacting authorization headers, cookies, passwords, document contents, bank details and secrets. Monitor:

- authentication success/failure and refresh reuse;
- quote creation, expiry and execution latency;
- idempotency conflicts and duplicate-attempt prevention;
- order rejection/cancellation rates;
- wallet and ledger reconciliation differences;
- WebSocket connection count, disconnects and sequence gaps;
- frontend error rate, route performance and failed API requests.

Financial alerts must be actionable and tied to incident procedures. Audit events and operational logs have different retention and access requirements.

## Release and rollback

1. Run the complete frontend and backend gates.
2. Verify API compatibility and database migrations before frontend activation.
3. Deploy backend changes compatibly before clients that require them.
4. Use immutable versioned artifacts and record the deployed commit/build ID.
5. Smoke-test authentication, markets, one non-financial mutation and the purchase quote flow in staging.
6. Roll back static assets independently when the API remains backward compatible.

Never roll back a financial database by deleting ledger history. Correct financial state with explicit compensating entries and audited procedures.
