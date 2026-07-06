# PrepRoute — Test Management App

A test management application built as part of the Preproute frontend assignment. Admins can create tests, configure marking schemes, add MCQ questions, and publish tests — either immediately or on a scheduled date.

**Live Demo:** [add your deployed link here]  
**Backend API:** `https://admin-moderator-backend-staging.up.railway.app/api`

---

## Pages

| Route | Page |
|---|---|
| `/login` | Login |
| `/` | Dashboard — view all tests |
| `/tests/new` | Create a new test |
| `/tests/:id/edit` | Edit test details |
| `/tests/:id/questions` | Add MCQ questions |
| `/tests/:id/publish` | Preview and publish |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/sagar-developer08/PrepRoute-Test-Management.git
cd PrepRoute-Test-Management

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your API base URL in .env

# Start dev server
npm run dev
```

Test credentials: `vedant-admin` / `vedant123`

---

## Tech Stack

- **React 19 + TypeScript** — UI and type safety
- **Vite** — bundler and dev server
- **React Query (TanStack Query)** — server state management
- **React Hook Form + Zod** — forms and validation
- **Axios** — HTTP client
- **Radix UI** — accessible component primitives
- **React Router v7** — routing
- **SCSS + Tailwind CSS** — styling

---

## Technical Decisions

### Why React Query instead of Redux or Zustand?

Most of the state in this app is server state — tests, questions, subjects, topics. React Query handles that well out of the box: caching, background refetching, loading and error states, and mutation helpers with automatic cache invalidation. I didn't need a global client state store because there's no complex shared UI state between unrelated components. Local component state (`useState`) was enough for things like which dialog is open or which question slot is active.

### React Hook Form + Zod

The test creation form has a lot of fields and some tricky interdependencies (topics depend on subject, subtopics depend on topics). React Hook Form keeps re-renders minimal by keeping form state uncontrolled under the hood — that matters on a dense form. Zod schemas double as TypeScript types via `z.infer`, so I'm not maintaining separate type definitions and validation rules side by side.

### Feature-based folder structure

Each domain (auth, dashboard, tests, questions, metadata) owns its own `pages/`, `components/`, `hooks/`, and `api/` files rather than grouping everything by type. It makes it easier to understand what belongs to what, and if a feature is removed, you can delete one folder instead of hunting across four.

### Centralized HTTP client

All API calls go through a single Axios instance in `src/shared/services/httpClient.ts`. This handles the base URL from env, attaches the Bearer token on every request, and redirects to login on 401. Feature-level `api/` files just export typed async functions — no auth or interceptor logic leaks into them.

### Cascading dropdowns with `enabled` queries

Subject → Topic → Subtopic is a three-level cascade. I used React Query's `enabled` option so topic queries only fire when a subject is selected, and subtopic queries only fire when at least one topic is picked. This keeps the network tab clean and avoids unnecessary requests on every render. Hydrating these selects when editing an existing test required staggered `useEffect`s — each one waits for its dependency list to load before setting the form value.

### Question editor — slot-based approach

Instead of rendering all N questions as a list, the question page shows one at a time with a sidebar of slots. Switching slots auto-saves the current question to the API before moving. This keeps the UI focused and avoids managing a list of partially-filled forms simultaneously. The sidebar gives a quick at-a-glance view of which questions are done vs. empty.

### Radix UI for component primitives

I built the UI layer on top of Radix — Dialog, Select, DropdownMenu, RadioGroup, Tabs etc. Radix handles accessibility (keyboard navigation, focus trapping, ARIA attributes) out of the box. I just styled on top of it with my own class names rather than using a pre-built kit like shadcn. Keeps the bundle lean and the design exactly as needed.

### One thing I'd revisit

The auto-save on slot switch is async — if you switch questions very quickly you could theoretically trigger overlapping save requests. With more time I'd add a save queue or cancel in-flight requests before starting the next one.

---

## Project Structure

```
src/
├── app/           # App entry, routes, providers
├── features/
│   ├── auth/      # Login, protected route, auth context
│   ├── dashboard/ # Test list table
│   ├── tests/     # Create, edit, publish flows
│   ├── questions/ # MCQ editor
│   └── metadata/  # Subjects, topics, subtopics API
├── shared/        # Reusable hooks, components, utils, HTTP client
├── styles/        # SCSS design tokens, themes, base styles
└── ui/            # Primitive components (Button, Input, Dialog, etc.)
```
