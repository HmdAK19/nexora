# Nexora documentation

This directory is the maintained engineering reference for the Nexora frontend. Each document has a distinct purpose so implementation details, product status and production requirements are not mixed together.

| Document                          | Audience                                 | Purpose                                                                  |
| --------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------ |
| [Features](FEATURES.md)           | Product and engineering                  | Route inventory, implemented behavior, integration status and known gaps |
| [Architecture](ARCHITECTURE.md)   | Frontend engineers                       | Module boundaries, dependency rules, state ownership and data flow       |
| [API](API.md)                     | Frontend/backend engineers               | Required HTTP and WebSocket contract                                     |
| [Design system](DESIGN_SYSTEM.md) | Product designers and frontend engineers | Visual foundations, responsive behavior, localization and accessibility  |
| [Security](SECURITY.md)           | Engineering and security reviewers       | Trust boundaries, threat controls and production-readiness requirements  |
| [Testing](TESTING.md)             | Engineers and reviewers                  | Automated coverage, test layers, commands and missing suites             |
| [Development](DEVELOPMENT.md)     | Contributors                             | Workflow, public exports, localization and definition of done            |
| [Operations](OPERATIONS.md)       | Platform and release engineers           | Build, deployment, proxy, PWA, observability and rollback requirements   |

## Source-of-truth rules

- The implementation is authoritative when documentation and code disagree; the documentation must then be corrected in the same change.
- “Frontend-integrated” means the UI implements and consumes the documented contract. It does not prove that a production backend, custody service or regulated workflow exists.
- Security controls that require server enforcement are described as backend requirements, never as guarantees provided by hidden UI.
- Example payloads are illustrative and must not contain real credentials, personal data or secrets.
- Screenshots use deterministic synthetic data and contain no customer information.

## Keeping documentation current

Update the corresponding document whenever a change affects:

- routes, permissions or user-visible behavior;
- request/response contracts or WebSocket messages;
- feature/module ownership or shared abstractions;
- validation, authentication or security assumptions;
- responsive behavior, accessibility or localization;
- tests, build commands, deployment or operational requirements.
