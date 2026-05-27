# SecureVault Design System

This document defines the core tokens and component states used by the SecureVault Dashboard (Dark Mode).

## Typography Scale
- Primary font: Inter, sans-serif
- Monospace font: JetBrains Mono, monospace

Scale:
- H1 (Display): 1.875rem / 30px — 700
- H2 (Section): 1.25rem / 20px — 600
- H3 (Card Title): 1rem / 16px — 600
- Body Large (Explorer labels): 0.9375rem / 15px — 500
- Body (Default): 0.875rem / 14px — 400
- Caption / Console: 0.75rem / 12px — 400

## Color Palette (Dark Mode tokens)
- --canvas-deep: hsl(230, 25%, 7%)
- --surface-dark: hsl(230, 20%, 11%)
- --surface-light: hsl(230, 15%, 16%)
- --surface-selected: hsla(160, 100%, 45%, 0.08)
- --accent-secure: hsl(160, 100%, 45%)
- --accent-info: hsl(190, 100%, 45%)
- --text-primary: hsl(210, 16%, 92%)
- --text-muted: hsl(215, 8%, 45%)
- --danger: #ff3b5c

Usage guidelines:
- Use `--canvas-deep` for full-page background.
- Use `--surface-dark` for primary panels and cards.
- Accent colors (`--accent-secure`, `--accent-info`) should be used sparingly to indicate verified state and in-progress actions.

## Spacing Grid
- Base spacing unit: 8px
- Small: 4px
- Base: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px

Layout notes:
- Left explorer uses a 16px indent per depth level plus 8px base offset.

## Component States
- Button
  - Default: background `transparent`, border `1px solid rgba(255,255,255,0.04)`
  - Hover: background `rgba(255,255,255,0.02)`
  - Active (primary): background `--accent-info` or `--accent-secure` with light text
  - Disabled: opacity 0.5, pointer-events none

- Explorer Item
  - Default: text `--text-primary`
  - Hover: background `--surface-light`
  - Selected: background `--surface-selected`, left border `2px solid --accent-info`
  - Focused (keyboard): outline `2px solid rgba(190, 245, 255, 0.08)` and subtle glow

- Hash Card
  - Idle: muted text, placeholder scrambled hex
  - Scanning: animated scrambled characters, progress bar with `--accent-info`
  - Verified: green badge `--accent-secure`, confirmed hash displayed

## Accessibility Notes
- All interactive elements must be keyboard reachable (tabindex as necessary).
- Ensure contrast ratios meet WCAG AA for primary text on dark surfaces.
- Use `aria-expanded`, `role=tree`, `role=treeitem`, and `aria-selected` in the explorer.

---

For visual frames and component mockups, see the Figma file referenced in the project's README or request a PDF export.