# Repository working rules

- Update the relevant files under `docs/` and `README.md` whenever behavior, routes, API contracts, architecture, configuration, security assumptions, test coverage or feature status changes.
- Documentation is part of the definition of done; do not describe local/demo behavior as production-ready.
- Do not create Git commits unless the project owner explicitly requests them.
- Do not open or run the application in a browser unless the project owner explicitly requests it.
- Keep the entire `server/` directory ignored and out of frontend commits. It is intended for a separate backend repository.
- Keep Persian and English localization in sync for every user-visible change.
- Run formatting, typecheck, lint, tests and the production build in proportion to the change.
