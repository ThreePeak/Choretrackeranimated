# Family Chore Tracker Pro

A gamified, collaborative task management application built with **React 18** and **Framer Motion**. This app helps families track household chores, visualize workload distribution with interactive charts, and compete for "Weekly MVP" status through high-fidelity UI interactions.

## 🚀 Key Features

*   **Interactive Dashboard**: 
    *   Real-time "7-Day Trend" graphs with spring-physics entry animations.
    *   "Member Share" donut charts with rotational entry effects.
    *   Weekly MVP highlighting based on logic aggregation.
*   **Gamification**:
    *   **Streaks**: Visual fire icons for consistent chore completion (3+ times).
    *   **Leaderboards**: Comparative stats for "Most Active", "Time Lord" (duration), and "Night Owl".
*   **Visual "Pop" (Eye Candy)**:
    *   Aggressive use of `framer-motion` (v10.x) for layout transitions (`<AnimatePresence>`).
    *   Staggered list entries and spring-based hover/tap interactions.
    *   Smooth page transitions between Dashboard, Details, Settings, and Stats views.
*   **Data Portability**:
    *   **GitHub Integration**: One-click repository creation and file upload directly from the browser.
    *   **JSON Export/Import**: Full backup and restore capability.
*   **Persistence**: Uses `localStorage` to persist state across reloads without a backend database.

## 🛠 Tech Stack & Constraints

This project adheres to specific version constraints for stability and React 18 compatibility:

*   **Core**: React 18.2.0 (Strict Mode enabled).
*   **Bundler**: Vite 5.x.
*   **Animations**: `framer-motion` **v10.16.4** (Pinned to support React 18 while providing spring physics).
*   **Styling**: Tailwind CSS 3.4.
*   **Icons**: Lucide React.

## 📂 Project Structure

*   **`App.tsx`**: Main entry point handling routing (state-based view switching), global state management, and persistence effects.
*   **`components/Charts.tsx`**: Reusable visualization components (Weekly Graph, Donut Chart, Distribution Bars) heavily animated with Framer Motion.
*   **`utils.ts`**: Helper functions for date normalization, color generation, and heuristic duration estimates.
*   **`project-files.ts`**: A "Virtual File System" containing the source code of the project itself, used by the `handleGithubUpload` function to replicate the project to a GitHub repo.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🧠 Data Model

The application uses a relational-like structure stored in a flat JSON object:

*   **Members**: `{ id, name, color }`
*   **Chores**: `{ id, name, category, order }`
*   **Logs**: `{ id, choreId, memberId, timestamp }`

*Note: Timestamps are normalized in `utils.ts` to handle both ISO strings and Firestore-like objects for robustness.*
