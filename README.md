# 🛡️ SecureVault Dashboard - Enterprise Cloud Storage Explorer

A high-performance, accessible, and cyber-secure digital vault explorer designed for secure environments (such as law firms and banks). Built from scratch using **React 18** and **Vite** with a custom **"Cyber-Secure Dark Mode"** design system.

---

## 🎨 Phase 1: The Design System

SecureVault's visual language is tailored to feel **precise, high-security, fast, and visually commanding**. Rather than relying on generic black backgrounds, we have crafted a tailored, high-fidelity dark mode with vivid cybernetic accents.

*   **🎨 Figma Design Specifications:** [SecureVault UI Design File (Public)](https://figma.com/file/securevault-enterprise-dashboard-spec)

### Typography Spec
*   **Sans-Serif Font:** `'Inter', sans-serif` (Default UI elements)
*   **Monospace Font:** `'JetBrains Mono', monospace` (Cryptographic hashes, file sizes, and activity logs)
*   **Scale Grid:**
    *   `Display Title (H1):` `1.875rem` (30px) | Bold | Letter-spacing: `-0.025em`
    *   `Section Title (H2):` `1.25rem` (20px) | Semi-Bold
    *   `Explorer Label (Body Large):` `0.9375rem` (15px) | Medium
    *   `General Body Text:` `0.875rem` (14px) | Regular
    *   `Console / Metadata (Caption):` `0.75rem` (12px) | Regular

### Color Palette Tokens
*   **Deep Canvas (`--canvas-deep`):** `hsl(230, 25%, 7%)` — Deepest space navy.
*   **Surface Dark (`--surface-dark`):** `hsl(230, 20%, 11%)` — Core container background.
*   **Surface Light (`--surface-light`):** `hsl(230, 15%, 16%)` — Hover highlight state.
*   **Selected Surface (`--surface-selected`):** `hsla(160, 100%, 45%, 0.08)` — Selected file accent overlay.
*   **Secure Accent (`--accent-secure`):** `hsl(160, 100%, 45%)` — Luminous neon green for active security, verified blocks, and folder listings.
*   **Info/Focus Accent (`--accent-info`):** `hsl(190, 100%, 45%)` — Luminous cyan for keyboard selections and key handshake stages.
*   **Muted Text (`--text-muted`):** `hsl(215, 8%, 45%)` — Inactive, secondary info.

---

## ⚙️ Setup & Deployment Instructions

Follow these commands to install the dependencies and boot up the high-security dashboard locally:

### Prerequisites
*   **Node.js:** `v18.0.0` or higher
*   **npm:** `v9.0.0` or higher

### Steps
1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start development server:**
    ```bash
    npm run dev
    ```
3.  **Build production-ready package:**
    ```bash
    npm run build
    ```
4.  **Preview production bundle:**
    ```bash
    npm run preview
    ```

The server runs locally at [http://localhost:3000](http://localhost:3000) with hot module reloading enabled.

---

## 🧠 Technical Strategies

### 1. Recursive Tree Strategy & State Management
The provided document structure (`data.json`) represents an arbitrarily nested hierarchy of folders and files. We developed a robust recursive tree renderer using the React component `FileTreeNode`.

*   **Recursive Component Structure:**
    Every folder node renders its own details and conditionally maps over its `children` array to invoke `FileTreeNode` recursively, passing down an incremented `depth` value.
*   **Visual Indentation Formula:**
    Padding is dynamically calculated using a proportional depth formula:
    `padding-left = depth * 16px + 8px`
    This allows the UI to handle 20+ levels of deep nesting beautifully without structural degradation.
*   **O(1) Toggle State:**
    Instead of passing heavy callbacks to update individual nested objects, folder states are maintained globally in a single `Set` containing the IDs of expanded folders: `expandedFolders = Set<string>`. Toggling folders has an $O(1)$ lookup and state update complexity.

### 2. High-Performance Keyboard Accessibility & Focus
To satisfy keyboard standards without using heavyweight third-party libraries, we implemented a custom keyboard navigation controller on the tree container.

*   **The Flat List Visibility Matrix:**
    To enable seamless `Up`/`Down` traversal on a recursive tree, the app pre-compiles a **dynamic flat list** of currently visible nodes based on folder expansion states:
    ```javascript
    function getVisibleNodes(nodes, expandedSet) {
      const list = [];
      function traverse(n) {
        list.push(n);
        if (n.type === 'folder' && expandedSet.has(n.id)) {
          n.children.forEach(traverse);
        }
      }
      nodes.forEach(traverse);
      return list;
    }
    ```
*   **Arrows & Select Mapping:**
    *   `ArrowDown` / `ArrowUp`: Shifts focus index sequentially within the computed flat list.
    *   `ArrowRight`: Expands a collapsed folder. If already expanded, focus transitions to its first child.
    *   `ArrowLeft`: Collapses an expanded folder. If already collapsed or if the item is a file, focus transitions to its parent folder by indexing the child-parent backtrack mapping table.
    *   `Enter`: Focus item undergoes inspection selection; folder expansion states toggle dynamically.

### 3. Bonus Feature: Smart Search & Path Auto-Expansion
*   **Indexing:** We pre-compute an ancestor mapping table that maps every item ID to its parent.
*   **Auto-Reveal:** When searching, if an item's name matches the query, we trace its ancestor chain back to the root and insert all intermediate parent IDs into the `expandedFolders` set. This automatically unfolds deeply nested matching records, instantly revealing the target items.
*   **Query Highlight:** Text matches are wrapped dynamically in `<mark className="cyber-mark">` tags for high-contrast neon visual cues.

---

## ⚡ The Wildcard Innovation: The Cryptographic Operations & Integrity Center

To move beyond a static file explorer and address the specific security compliance demands of enterprise banks and law firms, we implemented an interactive **Operations Chamber** and a **Cyber Security Activity Terminal**.

### Interactive Features
1.  **Live SHA-256 Integrity Checker:**
    Clicking a file allows the user to trigger a client-side simulated cryptographic verification scan. The system displays a characters-scrambler matrix animation, fills a neon progress bar, and outputs a secure green badge matching a deterministic SHA-256 digest signature.
2.  **Hardware Enclave Decryptor (ECDH & AES-256):**
    Clicking "Decrypt & Download" initiates a simulated **Elliptic-Curve Diffie-Hellman (ECDH) key handshake** and **AES-256 block decryption** sequence before generating a client-side Blob containing the decrypted document payload.
3.  **Auditing Activity Ledger:**
    Every single user action (mount, collapse, expand, select, search, verify, download) triggers an instant log entry in a cyber terminal console at the bottom of the interface, giving legal and compliance officers a transparent audit trail.
