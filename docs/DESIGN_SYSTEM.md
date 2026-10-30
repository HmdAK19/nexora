# Design system

Nexora uses a reusable Material UI token system and feature-owned components to keep visual decisions consistent across the product. Avoid page-local brand colors and duplicated primitives.

## Foundations

| Token                | Dark      | Light     | Purpose                  |
| -------------------- | --------- | --------- | ------------------------ |
| `background.default` | `#0b0e14` | `#f5f7fb` | Application canvas       |
| `background.paper`   | `#141821` | `#ffffff` | Cards and panels         |
| `surface.elevated`   | `#1a1f2b` | `#f9fafc` | Raised controls          |
| `surface.border`     | `#252c3c` | `#e6e9f0` | Structural borders       |
| `primary.main`       | `#1769ff` | `#1769ff` | Primary action/selection |
| `secondary.main`     | `#20d6c7` | `#20d6c7` | Brand accent             |
| `success.main`       | `#28d7a2` | `#28d7a2` | Positive/buy state       |
| `error.main`         | `#ff4d78` | `#ff4d78` | Negative/sell state      |
| `warning.main`       | `#ffad32` | `#ffad32` | Attention/risk           |

Spacing uses MUI’s 8px base. Global corner radius is 14px; buttons and outlined inputs use 11px. Cards use borders rather than large shadows. Typography uses Inter, Vazirmatn and system fallbacks with fluid page headings.

### Brand identity

The Nexora mark is a continuous `N` monogram representing connected markets and exchange flow. Its cyan node represents the user at the center of the network. The mark uses the primary blue gradient and secondary cyan accent, remains recognizable without the wordmark and is shared by the application shell, authentication surface, favicon and PWA icons. The wordmark highlights the `x` as the visual exchange point.

## Layout

- Minimum supported viewport width is 320px.
- Desktop uses a compact permanent sidebar; below `md` it becomes a direction-aware drawer.
- The application toolbar and sidebar brand header share one responsive height token so their lower borders stay aligned.
- Main page padding and grids step down at small breakpoints.
- Trading panels use responsive grid templates so Full HD laptop screens keep the primary terminal together as long as usable width permits.
- Desktop order books show the nearest eight asks and bids around the midpoint so both sides remain visible together; compact layouts show six levels per side.
- On wide layouts the Order Book card spans the chart and order-entry rows, while its title and depth rows retain their compact spacing at the top of the card.
- The wide trading terminal uses named grid areas: order book, chart/order entry and market/recent-trade sidebar. At medium and small breakpoints these areas stack without removing functionality.
- Market and recent-trade lists expand to consume their section's available sidebar height; overflow scrolls inside the full-height list region rather than leaving unused space below short viewports.
- Recent-trade prices align to the logical start of their rows, so the column hugs the left edge in LTR and the right edge in RTL.
- Tabs may scroll horizontally instead of forcing translated labels to wrap.
- Administration workspaces use a horizontally scrollable, permission-filtered navigation; user search is server-paginated inside a responsive table container, while queues and settings collapse to one column on narrow screens.
- Long IDs and financial values use controlled wrapping and end alignment.

## Component ownership

- Shared primitives (`PageHeading`, `PageFeedback`, `SkeletonState`, the composable skeleton layouts, `StatCard`, `AssetAvatar`, `Sparkline`, `BrandLogo`) live in `shared/ui`.
- Domain-specific components stay in their feature.
- Promote a component to `shared/ui` only after at least two unrelated features need the same stable API.
- Component-specific styles live in a neighboring `*.styles.ts` or the feature style module, not inline in page orchestration.

## Interaction states

Every data-driven interaction should define loading, empty, error, success, disabled and retry behavior. Financial forms additionally prevent rapid duplicate submission, show quote expiry and preserve safe retry identifiers.

The account menu uses a compact identity summary, isolates the destructive sign-out action and preserves native menu keyboard navigation, focus restoration and Escape dismissal. Its trigger collapses to the avatar on narrow viewports while retaining an accessible name. Language switching is a separate, always-visible toolbar control; its text collapses to an icon and language badge on narrow viewports.

Authentication forms share one responsive compact shell and remain approximately vertically centered in their content column. The footer leaves the desktop centering flow while remaining inline on narrow screens. Password requirements use balanced inner padding and a low-height adaptive grid, optional phone guidance is available from a keyboard-accessible field tooltip, and demo-account actions use direction-safe gaps rather than directional margins.

Error messages in narrow panels stack retry actions below the message instead of compressing icon, copy and action into one row.
Market, recent-trade and order-book query failures all expose the same full-width retry pattern and disable duplicate retries while a refetch is active.

Initial and incremental content loading uses shape-matched skeletons. Page skeletons are composed from shared heading, statistic, row, card-grid and form primitives so features keep their domain-specific layout without duplicating loading markup. Progress indicators remain appropriate for short mutations inside controls, where replacing the control with a skeleton would hide context or change layout.

Green/red states always include text, sign, icon or side labels; color is not the only signal. Controls remain keyboard accessible through native elements and MUI focus behavior.

## Localization and direction

- User-visible text belongs in feature locale JSON, not conditional `fa ? ... : ...` expressions.
- English uses LTR and Persian uses RTL.
- Direction-specific Emotion caches apply prefixing and RTL transformation to MUI internals; do not render the application outside `AppProviders`.
- Project styles use logical properties such as `marginInlineStart`, `insetInlineEnd` and `borderInlineEnd` instead of physical left/right spacing.
- Drawer anchor, document direction and theme direction follow the active language.
- Layout must tolerate longer translated strings and localized numbers/dates.
- New namespaces must be declared in `app/i18n/namespaces.ts` and registered for both languages in `app/i18n/config.ts`.

## Accessibility

- Use semantic forms, buttons, headings and landmarks.
- Associate labels and validation feedback with form controls.
- Dialogs rely on MUI focus containment, Escape handling and focus restoration.
- Async results that matter use alerts or `aria-live` regions.
- Icons without independent meaning are hidden from assistive technology.
- Keep visible focus indicators and WCAG AA contrast for essential text/actions.

## Motion

Motion is restrained to route transitions, login ambience and live/chart interactions. New animations should honor `prefers-reduced-motion`; functional information must remain available without animation.
