# Design system

Nexora translates the supplied Figma screenshots into reusable Material UI tokens rather than page-local colors.

## Foundations

| Token                | Dark value | Use                                |
| -------------------- | ---------- | ---------------------------------- |
| `background.default` | `#0b0e14`  | application canvas                 |
| `background.paper`   | `#141821`  | cards and panels                   |
| `surface.elevated`   | `#1a1f2b`  | controls and raised regions        |
| `primary.main`       | `#1769ff`  | primary actions and selection      |
| `secondary.main`     | `#20d6c7`  | brand accent and positive emphasis |
| `success.main`       | `#28d7a2`  | buy/positive movement              |
| `error.main`         | `#ff4d78`  | sell/negative movement             |
| `warning.main`       | `#ffad32`  | risk and attention                 |

Spacing uses MUI's 8px base. Corners are 11–14px. Borders carry hierarchy instead of large shadows. Type uses Inter/Vazirmatn/system fallbacks and fluid headings.

## Interaction rules

- Green and red always appear with text, arrows, or side labels; color is never the sole signal.
- Controls retain visible browser/MUI focus rings.
- Motion is limited to route transitions, login ambience and live-chart state.
- Tables collapse into two-column summaries on small screens.
- Desktop sidebar becomes a focus-managed drawer below the medium breakpoint.
- Loading, error, empty and success states are explicit.

## Extending

Add brand colors only in `src/app/theme/index.ts`. Build domain components inside their feature; promote them to `shared/ui` only after at least two unrelated features need the same API.
