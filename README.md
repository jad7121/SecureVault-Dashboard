# SecureVault Dashboard

A polished enterprise file explorer built with React and Vite. SecureVault Dashboard delivers secure hierarchical navigation, file metadata inspection, keyboard-first accessibility, and a modern cyber-secure UI.

## Design System

The application follows a dedicated dark-mode design system with clear tokens for typography, color, spacing, and component states.

- **Design export:** [SecureVault Design System PDF](./design/SecureVault_Design_System.pdf)
- **Typography:** `Inter` for UI, `JetBrains Mono` for terminal and metadata text
- **Color palette:** deep navy canvas, dark surfaces, neon secure green, cyan focus accents, muted gray text
- **Spacing grid:** 4px, 8px, 16px, 24px, 32px
- **States:** hover, selected, focused, disabled, scanning, verified

## Features

- Recursive folder explorer powered by `data.json`
- Expand/collapse folders on click
- File selection updates the properties panel
- Keyboard navigation with `ArrowUp`, `ArrowDown`, `ArrowRight`, `ArrowLeft`, and `Enter`
- Search-driven filtering with automatic path expansion
- Wildcard feature: interactive cryptographic scan and decryption simulation
- Draggable floating activity terminal for audit logs

## Setup

### Prerequisites

- Node.js `>= 18`
- npm `>= 9`

### Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Production build

```bash
npm run build
npm run preview
```

## Recursive Strategy

The folder tree is rendered with a recursive React component named `FileTreeNode`.

- Each node renders itself and recursively renders its `children` when the folder is expanded.
- Indentation is computed dynamically using `depth * 16 + 8`.
- Expansion state is stored in a single `Set<string>` called `expandedFolders`, enabling efficient toggles and rendering.

This approach supports deep hierarchies without structural issues.

## Keyboard Accessibility

Keyboard navigation uses a flattened list of visible nodes so focus movement stays consistent across the recursive tree.

- `ArrowDown` / `ArrowUp` moves focus between visible items
- `ArrowRight` expands folders or drills into the first child
- `ArrowLeft` collapses folders or shifts focus to the parent
- `Enter` selects the focused item

The interface includes `role="tree"`, `role="treeitem"`, `aria-expanded`, and `aria-selected` for screen-reader compatibility.

## Wildcard Feature

The wildcard addition is a **Cryptographic Operations Chamber** that elevates the explorer into a secure operations console.

- Simulated SHA-256 integrity scan for selected files
- Enclave-style decrypt & download workflow with ECDH/AES-256 semantics
- Real-time audit logging in a draggable console

This feature reinforces SecureVault’s enterprise security narrative while adding tangible value for compliance-focused workflows.

## Notes

- The app uses the provided `data.json` without changing its schema
- UI components are custom built; no restricted libraries like Bootstrap, Material UI, Chakra UI, or Ant Design are used
- A design system PDF is included at `design/SecureVault_Design_System.pdf`
