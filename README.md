# AccuKnox Dashboard

A React dashboard created for the AccuKnox frontend trainee assignment.

## Features

- Dashboard categories and widgets loaded from JSON.
- Add custom widgets to a selected category.
- Remove widgets using the remove icon.
- Select or deselect available widgets using checkboxes.
- Search widgets by name or text.
- Save dashboard changes in browser `localStorage`.
- Right-side Add Widget drawer based on the assignment reference.
- Responsive dashboard layout.

## Technologies

- React
- JavaScript
- CSS
- Vite
- JSON
- Browser `localStorage`

## Prerequisites

Install Node.js and npm.

## Run locally

1. Extract the ZIP file.
2. Open the extracted project folder in VS Code.
3. Open a terminal in that folder.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Verify the production build

```bash
npm run build
```

## Dashboard data

Initial categories and widgets are stored in `src/data/dashboardData.json`. Changes made in the dashboard are stored in browser `localStorage`.

To reset the dashboard, use the Reset button in the application.
