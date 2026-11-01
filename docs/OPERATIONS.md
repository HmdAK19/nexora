# Configuration, deployment and operations

[English](OPERATIONS.md) | [فارسی](OPERATIONS.fa.md)

## Runtime topology

The frontend is a static SPA. In development, Vite serves it on port `5173` and proxies API/WebSocket traffic to `http://localhost:4000`. In production, a reverse proxy or gateway should serve the static build and route `/api` and `/ws` to backend services on the same public origin.

```text
https://exchange.example
  ├─ /assets/*, /index.html → static frontend/CDN
  ├─ /api/*                → HTTP API
  └─ /ws                   → WebSocket market gateway
```

Same-origin deployment simplifies cookies, CORS and WebSocket configuration. If origins differ, explicitly configure CORS, credentials, cookie domain/SameSite and CSRF controls.

## Runtime configuration

The frontend does not compile backend addresses into its application chunks. Before React starts, it fetches `/runtime-config.json` with `cache: no-store`, validates the complete payload and initializes HTTP/WebSocket transports from it.

```json
{
  "apiBaseUrl": "/api",
  "webSocketUrl": "/ws"
}
```

| Field          | Accepted values                     | Purpose                                   |
| -------------- | ----------------------------------- | ----------------------------------------- |
| `apiBaseUrl`   | Root path or absolute `http(s)` URL | Axios base URL, normally ending in `/api` |
| `webSocketUrl` | Root path or absolute `ws(s)` URL   | Live market WebSocket endpoint            |

Examples:

```json
{
  "apiBaseUrl": "https://api.example.com/api",
  "webSocketUrl": "wss://api.example.com/ws"
}
```

`public/runtime-config.json` is copied to `dist/runtime-config.json` during build. To promote the same immutable frontend image between environments, replace or mount only that JSON file at deployment time. Kubernetes may mount it from a ConfigMap; a container entrypoint or platform release step may render it from non-secret environment values.

Operational requirements:

- serve the file as `application/json` with `Cache-Control: no-store, max-age=0`;
- do not fingerprint or CDN-cache the file;
- keep it outside the service-worker precache (already configured in `vite.config.ts`);
- update it atomically so clients never observe a partial document;
- use HTTPS/WSS in production;
- configure credentialed CORS, cookie `SameSite`/domain and CSRF defenses when the API is cross-origin;
- never include secrets, tokens or private provider credentials because every visitor can read it.

Missing, malformed, incomplete or unsafe configuration stops application bootstrap and displays a bilingual configuration error. The application does not silently fall back to a different production backend.

Development still uses the root-relative defaults. Vite proxies `/api` to `http://localhost:4000` and `/ws` to `ws://localhost:4000`. The build target is ES2022 and source maps are enabled.

## Backend integration

The backend is maintained and deployed independently in [`HmdAK19/nexora-api`](https://github.com/HmdAK19/nexora-api). In local development the frontend expects it on port `4000`; production should expose it behind the same public origin as `/api` and `/ws`.

The current Vercel deployment uses the separate `https://nexora-api-hmd12.vercel.app` backend and a Neon PostgreSQL resource connected through Vercel Marketplace. Runtime database traffic uses the pooled connection while Prisma migrations use the unpooled connection. The market WebSocket gateway falls back to five-second provider REST polling when the upstream Binance stream is unavailable from serverless infrastructure.

The public portfolio deployment intentionally advertises shared administrator and customer demo credentials on the login page. Treat both accounts and their data as disposable. Before promoting the application beyond a demonstration environment, remove the credentials from the UI, rotate both passwords, disable or replace the seeded users and review every administrator capability exposed by the API.

The backend deployment must provide its own documented configuration for:

- HTTP/WebSocket listeners and trusted client origins;
- access/refresh signing keys loaded from a secrets manager;
- durable database, ledger and audit stores;
- custody, identity, payment and notification providers;
- market-data provider URLs, credentials, timeouts and failover;
- rate limits, request-size limits, telemetry and alerting.

Production services must fail startup when required secrets or durable dependencies are absent. Market-data egress, regional availability and provider terms must be reviewed before release. Provider failure must produce an explicit stale/error state rather than fabricated prices.

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

Treat the JavaScript/CSS assets as immutable and long-cacheable, but deploy `runtime-config.json` with the no-cache policy above. Updating only this file changes the backend destination without rebuilding the application.

### Vercel

The repository includes `vercel.json` for Vite framework detection, SPA navigation fallback and the required no-cache header on `runtime-config.json`. The fallback excludes `/api` and `/ws`, which remain reserved for a separately deployed backend or gateway. Without that integration, a Vercel deployment is a frontend preview only: public routes render, while authentication and live-data requests reach no production service.

### Social preview metadata

`index.html` contains canonical Open Graph and Twitter Card metadata for the public demo. These tags are deliberately present in the initial HTML so crawlers such as LinkedIn can build a preview without executing the React application. The preview uses the same-origin `public/social-preview.png` dashboard image; keep its absolute URL, dimensions, the canonical deployment URL, title and description current when the public demo location or product positioning changes.

Deploy from the repository root with the Vercel CLI or import the Git repository in Vercel. The current `public/runtime-config.json` uses the separately deployed Nexora API's absolute HTTPS and WSS endpoints. When either Vercel domain changes, update both runtime URLs and the backend `CLIENT_ORIGIN`, then verify CORS, cookies, CSRF controls and WebSocket upgrades end to end.

Production source maps help error diagnosis but may expose source. Upload them privately to the monitoring service or restrict public delivery according to deployment policy.

## PWA behavior

- Manifest name: Nexora Digital Asset Exchange.
- Display mode: standalone.
- Navigation fallback: `/index.html`.
- Service-worker updates use prompt registration.
- `runtime-config.json` is excluded from precache.
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
