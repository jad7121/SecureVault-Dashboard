
﻿# SecureVault Dashboard

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

## Deployment (Vercel)

You can deploy the project to Vercel for a quick production preview and CI-backed deployment.

Option A — Automatic GitHub deployment (recommended):

1. Push your repository to GitHub (your fork).
2. Go to https://vercel.com/new and select your GitHub repository.
3. For Framework Preset choose `Other` or `Vite` (Vercel will detect and use `@vercel/static-build`).
4. Build Command: `npm run build` — Output Directory: `dist` (this is already configured in `vercel.json`).
5. Deploy; Vercel will build and publish the site. Subsequent pushes to the branch will trigger automatic deployments.

Option B — Manual CLI deploy:

1. Install Vercel CLI: `npm i -g vercel`.
2. Authenticate: `vercel login`.
3. From the project root run: `vercel --prod` and follow prompts.

Notes:
- The repository includes `vercel.json` which configures the static build to use the `dist` directory produced by `npm run build`.
- Ensure your fork is public and the GitHub integration has access to the repository if using automatic deployments.
