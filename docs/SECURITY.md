# Security and production checklist

The frontend keeps access tokens in memory and relies on HttpOnly refresh cookies. Backend security controls, authentication enforcement and financial validation belong to the separate server repository.

Before production:

- Store password hashes, users and refresh-token hashes in a durable database.
- Add refresh-token families and reuse detection across devices.
- Use `Secure`, domain-scoped cookies behind HTTPS; add CSRF tokens if frontend/API become cross-site.
- Rate-limit login, refresh, orders and withdrawals; add progressive abuse controls.
- Require MFA/WebAuthn for withdrawal and security changes.
- Maintain an append-only double-entry ledger using fixed-precision decimals.
- Put matching and custody behind isolated, audited services with idempotency keys.
- Add KYC/AML, sanctions screening, withdrawal allowlists and manual risk controls.
- Use a secrets manager, structured audit logs and alerting. Never ship fallback development secrets.
- Commission independent security, smart-contract/custody and financial audits.

This repository contains no backend implementation and must never be treated as a complete exchange security boundary.
