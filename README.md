# Client Management Dashboard

An advanced, production-grade **Client Management Dashboard / Admin Prototype** built with React, Vite, and Tailwind CSS. Designed for administrators to monitor portfolio health, track client lifecycle stages, and perform seamless data operations with high usability and accessibility.

---

## Live Demo

- **Netlify Deployment:** `https://client-management-dashboard.netlify.app/` 
- **Demo Credentials:**
  - **Email:** `admin@demo.com`
  - **Password:** `admin123`
  - *(One-click "Auto-fill" button available on the login screen)*

---


## Project Objective

The objective of **ClientHub** is to provide an efficient, centralized web console for administrators, account managers, and business operators to manage client records, monitor onboarding statuses, search and filter high-volume client data, and maintain data hygiene without cognitive overhead.

---

## Problem Solved

Admins managing client relationships frequently struggle with:
- **Disorganized Records:** Scattered client contact information and unknown lifecycle stages.
- **Accidental Deletions:** Systems without confirmation dialogs causing permanent data loss.
- **Slow Information Retrieval:** Clunky tables lacking combined search, filtering, and column sorting.
- **Session Friction:** Poorly architected SPAs that kick users to login screens upon refreshing.

**ClientHub** solves these pain points through a unified, resilient, accessible, and responsive interface designed to scale.

---

## Features

### 1. Login UI
- Professional, accessible authentication interface.
- Client-side validation with real-time error clearing upon input.
- Password reveal toggle (`Eye` / `EyeOff`).
- One-click demo credentials auto-fill.
- Resilient session persistence (no redirect on browser reload).

### 2. Admin Dashboard
- High-level overview with operational KPIs and client metrics.
- Multi-section interface supporting Overview, Directory, Analytics, and Workspace Settings.
- Quick navigation between views.

### 3. Sidebar Navigation
- Dynamic active navigation indicators for Dashboard, Clients, Reports, and Settings.
- Responsive off-canvas drawer on mobile devices with backdrop overlay and `Escape` key support.
- Real-time client counter badge.

### 4. Client List
- High-contrast data table with client names, avatars, emails, company names, statuses, and join dates.
- Safe date rendering avoiding timezone off-by-one errors.
- Distinct empty states for zero database records vs. unmatched search/filter criteria.

### 5. Client Status
- Visually distinguishable badges for `Active`, `Pending`, and `Inactive` clients with glowing indicator dots.
- One-click quick status toggling from within the client detail modal.

### 6. Search
- Real-time, case-insensitive multi-field search across client names, email addresses, companies, and phone numbers.
- Inline clear button (`X`) within the search input.

### 7. Filtering
- Dropdown filter by status (`All`, `Active`, `Pending`, `Inactive`).
- Combined Search + Filter logic ensuring rigorous compound query evaluation.
- Interactive KPI cards doubling as instant status filter buttons.
- One-click "Reset Filters" action.

### 8. Basic Client Data Interaction
- **View Client Information:** Client profile modal displaying full contact details, company, notes, and ID.
- **Add Client:** Modal form with field-level validation and accessibility labels.
- **Edit Client:** In-place modification of existing client records.
- **Change Client Status:** Quick status switcher directly within the detail drawer.
- **Safe Delete:** Accessible confirmation modal (`ConfirmModal`) protecting against accidental record loss.
- **Reset Demo Data:** Option in Settings to restore the database to the default enterprise mock dataset.

### 9. Responsive UI
- Fully responsive layout optimized for mobile screens, tablets, laptops, and desktop monitors.
- Horizontal scroll preservation on data tables for smaller viewports.

### 10. Additional Features
- Multi-column table sorting (`Client`, `Company`, `Status`, `Joined`) with ascending/descending indicators.
- Interactive notification drawer in header with unread badge counter and "Mark all as read" capability.
- Automated test suite (27 passing tests) using Node.js built-in test runner.

---

## Technology Used

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router DOM 6
- **Styling:** Tailwind CSS 3 & PostCSS
- **Icons:** Lucide React
- **Language:** JavaScript (ES Modules, JSX)
- **Testing:** Node.js Test Runner (`node:test`, `node:assert`)

---

## Project Structure

```
client-dashboard/
├── public/
│   └── _redirects              # Netlify SPA routing fallback
├── src/
│   ├── components/
│   │   ├── ClientDetailModal.jsx # Full client profile view & quick status toggle
│   │   ├── ClientModal.jsx       # Add/Edit client form with field validation
│   │   ├── ClientTable.jsx       # Sortable data table with contextual empty states
│   │   ├── ConfirmModal.jsx      # Reusable accessible confirmation dialog
│   │   ├── Header.jsx            # Top header with notification drawer & user profile
│   │   ├── Sidebar.jsx           # Nav drawer with active indicators & mobile overlay
│   │   ├── StatsCard.jsx         # Interactive KPI filter card
│   │   └── StatusBadge.jsx       # Accessible status badge with glowing dot
│   ├── context/
│   │   ├── AuthContext.jsx       # Auth state, session persistence, login/logout
│   │   └── ClientContext.jsx     # Client state store, CRUD handlers, reset action
│   ├── data/
│   │   └── mockClients.js        # Initial enterprise mock dataset
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main dashboard view orchestrating state & modals
│   │   └── Login.jsx             # Login screen with validation & quick fill
│   ├── utils/
│   │   └── formatters.js         # Timezone-safe date formatting & avatar initials
│   ├── App.jsx                   # Route declarations & ProtectedRoute guards
│   ├── index.css                 # Tailwind directives & base styles
│   └── main.jsx                  # React DOM entry point
├── tests/
│   └── dashboard.test.js         # Comprehensive unit and integration test suite
├── .env.example                  # Example environment variable template
├── .gitignore                    # Git ignore specifications
├── index.html                    # HTML entry point
├── netlify.toml                  # Netlify deployment & SPA redirect configuration
├── package.json                  # Scripts & dependency definitions
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── vite.config.js                # Vite build configuration
```

---

## Installation

```bash
# Clone repository
git clone <your-github-repo-url>
cd client-dashboard

# Install dependencies
npm install
```

---

## Development

To start the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## Production Build

To build the project for production:

```bash
npm run build
```

The production assets will be generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Automated Tests

Run the built-in test suite:

```bash
npm test
# Or directly:
node --test tests/dashboard.test.js
```

---

## Deployment

### Deploying to Netlify via GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Client Management Dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Connect to Netlify**:
   - Log in to your [Netlify](https://www.netlify.com/) account.
   - Click **"Add new site"** > **"Import an existing project"**.
   - Select **GitHub** and authorize access to your repository.
   - Select your repository.

3. **Verify Build Settings**:
   - Netlify will automatically detect the settings from `netlify.toml`:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Click **"Deploy site"**.

4. **Verify SPA Routing**:
   - Both `netlify.toml` and `public/_redirects` are pre-configured to rewrite `/*` to `/index.html` with status `200`. Direct navigation and page reloads on any route will work smoothly.

---

### Option 2: Drag & Drop Deploy on Netlify (Instant)

If you want to deploy directly without connecting a Git repository:

1. **Build the production bundle**:
   ```bash
   npm run build
   ```
   *(This generates the optimized `dist/` directory containing the compiled SPA, static assets, and `_redirects` file).*

2. **Open Netlify Drop**:
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.

3. **Drag and Drop the `dist` folder**:
   - Drag the `dist` folder from your file manager into the upload area on Netlify Drop.
   - Netlify will instantly deploy your site and generate a live URL.

4. **Verify Deep Linking**:
   - Refresh `/login` or navigate between tabs; thanks to `_redirects` in `dist/`, all routes resolve seamlessly.
