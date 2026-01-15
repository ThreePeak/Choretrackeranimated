# Architecture & Design Decisions

This document outlines the internal logic, state management strategies, and animation patterns used in Family Chore Tracker Pro.

## 1. State Management & Persistence

### The "Database"
There is no backend. The application relies on `localStorage` key `chore_data_{appId}`.
*   **Read**: On mount (`useEffect`), the app parses the JSON string.
*   **Write**: Any change to `members`, `chores`, or `logs` triggers a `useEffect` that serializes the state back to `localStorage`.
*   **Concurrency**: Simple "Last Write Wins" logic. It is designed for single-device usage or manual JSON export/import for synchronization.

### Data Normalization
*   **Timestamps**: The app uses a `getTimestamp` utility wrapper. This is critical because `localStorage` serialization turns `Date` objects into strings. The utility ensures charts always receive a valid Millisecond Timestamp (number), preventing "NaN" errors in the trend graphs.

## 2. Animation Strategy (Eye Candy)

We utilize **Framer Motion 10.16.4** to achieve "aggressive" visual feedback while maintaining React 18 compatibility.

### Key Patterns:
1.  **View Transitions**:
    *   Wrapped in `<AnimatePresence mode="wait">`.
    *   Views exit with `{ opacity: 0, y: -20 }` and enter with `{ opacity: 1, y: 0 }`.
2.  **Layout Animations**:
    *   Lists (Chores, Members) use the `layout` prop. When items are reordered, added, or removed, sibling elements automatically slide into their new positions smoothly.
3.  **Micro-Interactions**:
    *   Buttons use `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.95 }}` to provide tactile feedback.
    *   Charts use `initial={{ height: 0 }}` with `type: "spring"` to create a "bouncing" grow effect on load.

## 3. The GitHub Integration ("Quine"-like feature)

The app contains a mechanism to replicate itself to a GitHub repository.

*   **Source of Truth**: `project-files.ts` contains the stringified content of all source files (`App.tsx`, `package.json`, etc.).
*   **Process**:
    1.  User supplies a Personal Access Token (PAT).
    2.  App checks for the repo; creates it if missing.
    3.  App checks for the specific branch; creates it from `main` if missing.
    4.  App iterates through `PROJECT_FILES`, creates a dynamic backup of current runtime data (`data_backup.json`), and commits them to the GitHub API via `PUT /repos/{owner}/{repo}/contents/{path}`.

## 4. Heuristics

*   **Chore Duration**: The app lacks a "duration" field for logs. Instead, it uses `estimateChoreDuration(choreName)` which regex-matches keywords (e.g., "wash" = 20m, "trash" = 5m) to calculate "Time Lord" stats.
*   **Categorization**: Similarly, `getChoreCategory` assigns icons/groups based on the chore name string.