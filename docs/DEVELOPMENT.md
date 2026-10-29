# Development guide

## Working agreement

- Do not commit changes unless the project owner explicitly requests a commit.
- Do not open or execute the application in a browser unless explicitly requested.
- Never track `server/`; backend work belongs in [`HmdAK19/nexora-api`](https://github.com/HmdAK19/nexora-api).
- Preserve unrelated working-tree changes.
- Update documentation in the same change whenever behavior, architecture, API, configuration, security or feature status changes.

## Adding or changing a feature

1. Identify observable behavior and server/client authority.
2. Add types and pure validation in `model`/`lib`.
3. Add transport functions and stable query keys in `api`.
4. Put orchestration, mutations and cache effects in hooks.
5. Keep page components focused on composition and view components as stateless as practical.
6. Add English and Persian locale keys; never branch on language in JSX.
7. Add explicit loading, error, empty, disabled, success and retry states.
8. Add focused tests and update the relevant documentation.
9. Run formatting, typecheck, lint, tests and production build.

## Public exports

Each directory exposes an `index.ts`. Feature root barrels export only the public surface needed outside the feature, commonly route pages and intentionally shared hooks. Internal components use local barrels. Avoid importing another feature’s private file path.

## Styling

Use theme tokens and neighboring style modules. Avoid broad global CSS and hard-coded near-duplicate colors. Start responsive layouts from narrow widths and use MUI breakpoints. Long Persian labels, financial IDs and values must not overflow.

## Server-state changes

- Query keys are factories owned by the feature API module.
- Read remote state with TanStack Query.
- Mutations explicitly update or invalidate related keys.
- Shared optimistic helpers are required for reversible list changes.
- Financial balance changes wait for confirmed server results.

## Localization checklist

- Add both `en.json` and `fa.json` values.
- Use the feature namespace through `NAMESPACES`.
- Check plural/interpolation values and localized dates/numbers.
- Avoid embedded English labels, ARIA labels and error messages.
- Ensure layout works in both RTL and LTR.

## API evolution

Update [API.md](API.md) before or alongside contract changes. Document method, path, auth, request, response, public errors, idempotency and cache consequences. Treat backend responses as `unknown` and parse them at runtime for financial or other high-risk boundaries.

## Documentation map

- Product behavior or completion status → `FEATURES.md`
- Module/dependency/state design → `ARCHITECTURE.md`
- Endpoints or WebSocket protocol → `API.md`
- visual tokens, responsiveness or accessibility → `DESIGN_SYSTEM.md`
- trust boundaries or controls → `SECURITY.md`
- test coverage or commands → `TESTING.md`
- setup, scripts or contributor workflow → `README.md` / `DEVELOPMENT.md`
- environment, deployment, PWA or monitoring → `OPERATIONS.md`

## Definition of done

A change is complete when implementation, localization, accessibility states, tests, documentation and relevant automated checks agree. For backend-dependent work, clearly distinguish a complete frontend integration from an unavailable production service.
