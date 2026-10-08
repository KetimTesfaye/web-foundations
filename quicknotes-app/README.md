QuickNotes App

QuickNotes is a lightweight, responsive web application designed to help users capture, categorize, search, and manage their daily notes and reminders efficiently directly within the browser.

Features

- Categorized Note Creation: Add notes under Personal, Work, or Study categories with custom color-coding.
- Form Validation: Real-time validation preventing empty submissions or notes exceeding 200 characters.
- Instant Search: Filter through your notes dynamically as you type keywords.
- Data Persistence: Automatically saves your notes to browser `localStorage` so data survives page refreshes.
- Responsive Layout: Clean card layout with Flexbox and media queries optimized for both mobile and desktop screens.
- Bonus Clear All: Bulk delete functionality with user confirmation prompts.

How to Run Locally

1. Clone or download the repository to your local machine.
2. Open the project folder in \*isual Studio Code.
3. Install the Live Server extension if not already installed.
4. Navigate to `quicknotes-app/index.html`, right-click, and select Open with Live Server.

What I Learned

1. DOM Manipulation & Safety: Learned how to dynamically build UI elements using `createElement` and `textContent` to ensure protection against Cross-Site Scripting (XSS).
2. State & LocalStorage Integration: Gained hands-on experience synchronizing application memory arrays with browser storage using `JSON.stringify` and `JSON.parse`.
3. Responsive CSS Design: Practiced using CSS variables, Flexbox layouts, and `@media` queries to ensure clean desktop and mobile styling.
