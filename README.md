<<<<<<< HEAD
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
=======
# SecureVault-Dashboard
This challenge is designed to test your ability to bridge Computer Science fundamentals with Modern Frontend Engineering.

## 1. Business Scenario & Context
**Client:** SecureVault Inc.  
**Industry:** Enterprise Cloud Security  

**The Problem:** SecureVault offers high-security cloud storage for law firms and banks. Their backend engineers have built a robust API that returns folder structures efficiently. However, their current frontend is a simple list that is hard to navigate. Clients are complaining that they can't manage nested files easily.

**Your Role:** You are the incoming Junior Frontend Engineer. Your task is to design and build a modern, high-performance "File Explorer" UI that impresses the CTO and the Design Lead.

---

## 2. The Assignment Stages
This is a **hybrid design/engineering challenge**. You are expected to demonstrate competence in both visual design logic and algorithmic frontend implementation.

### Phase 1: The Design System
**Before writing code, you must design the interface.**

* **Deliverable:** A link to a design file (Figma, Penpot, or Sketch) or a PDF export of your design frames.
* **Requirement:** Your design file must include a dedicated **"Design System" page** that defines:
    * **Typography Scale**
    * **Color Palette** 
    * **Spacing Grid**
    * **Component States**
* **Brand Guidelines:** SecureVault wants a "Dark Mode" aesthetic that feels "cyber-secure, precise, and fast."

### Phase 2: The Implementation 
**Build the application using the design system you created in Phase 1.**

* **Constraint:** You **cannot** use component libraries like Bootstrap, Material UI, Chakra UI, or Ant Design. You must build your components from scratch to prove you understand CSS layout and component abstraction.
* **Note:** CSS frameworks like Tailwind are allowed *only* if you use them to build your own reusable component architecture.

---

## 3. User Stories & Acceptance Criteria

### Core Features (Required)

#### Story 1: The Recursive Tree
> "As a lawyer with 10 years of case files, I need to navigate deeply nested folders without reloading the page."

* **AC 1:** The UI renders the folder structure from the provided JSON.
* **AC 2:** The component structure must be **recursive**. It should handle 2 levels of depth or 20 levels without breaking the UI.
* **AC 3:** Folders must expand/collapse on click.

#### Story 2: File Details & Inspection
> "As a user, I need to see file metadata to ensure I'm opening the right version."

* **AC 1:** Clicking a file "selects" it (distinct visual state based on your design).
* **AC 2:** A "Properties Panel" displays the selected file's Name, Type, and Size.

#### Story 3: Keyboard Accessibility
> "As a power user, I hate reaching for my mouse. I want to navigate the vault using only my keyboard."

* **AC 1:** `Up/Down` arrows move focus between the visible items in the explorer.
* **AC 2:** `Right` arrow expands a folder; `Left` arrow collapses it.
* **AC 3:** `Enter` selects the file.

### The "Wildcard" Feature (Required)

#### Story 4: The Innovation Clause
> "As a developer, I want to add one feature that the client didn't ask for, but would significantly improve the user experience."

* **Task:** Identify a gap in the requirements. What is missing?
* **AC 1:** Implement **one** additional feature of your choice.
* **AC 2:** In your README, explain *why* you chose this feature and how it adds value to the business.

### Bonus Feature (Optional)
#### Story 5: Search & Filter
* **AC 1:** A search bar filters the view. Matching items deep inside folders should force those folders to expand automatically.

---

## 4. Technical Requirements
* **Data:** Use the `data.json` file provided in this repo. Do not edit the JSON structure, but you may add more items to test performance.
* **Tech Stack:** React, Vue, Svelte, or Vanilla JS.
* **Documentation:** Your README in the submission must include:
    1.  Setup instructions.
    2.  Link to your Design File.
    3.  Explanation of your **Recursive Strategy** (how you managed the data structure).
    4.  Explanation of your **Wildcard Feature**.

---

## 5. Submission Instructions
1.  **Fork** this repository.
2.  Complete the code in your fork.
3.  **Update the README:**
    * **Delete** all the instructions in this file (the text you are reading now).
    * **Replace** them with your own documentation as outlined in Section 4.
    * *Note: Do not append your docs to the end. The final README should look like a professional project documentation, not a homework assignment.*
4.  Submit your repo link via the [online](https://forms.office.com/e/G6vaRQxWYM) form.

---
### ⚠️ CRITICAL: Pre-Submission Checklist

**STOP and review your work.** To be eligible for the Solution Defense interview, your submission **MUST** pass the following "Gatekeeper" checks.

If any of the following are incorrect, your submission will be flagged as incomplete and you will **NOT** be invited for an interview.

1.  **Public Repository:** Is your GitHub repository set to **Public**? (Private links will be auto-rejected).
2.  **Audit-Ready History:** Does your Git commit history show your progress over time? (Repositories with a single "Initial Commit" or "Upload files" containing the entire project will be **rejected as unverifiable**).
3.  **Working Deployment:** Have you tested your live link in an **Incognito/Private** window to ensure it loads without errors?
4.  **No Restricted Libraries:** Did you build your own components? (Submissions using **Bootstrap, Material UI, or Chakra UI** will be disqualified).
5.  **Design File Access:** Is your Figma/Penpot link included and set to **"Anyone with the link can view"**?
6.  **Documentation:** Have you deleted the original assignment text from the `README.md` and replaced it with your own project documentation?

> **By submitting your work, you acknowledge that failure to meet these criteria effectively ends your application process.**
>>>>>>> 741da8ecbb6681bcc0c2d6655219a642cd96c8bf
