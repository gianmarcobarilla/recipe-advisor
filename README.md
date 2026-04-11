# Recipe Advisor

A two-step recipe recommender built with React 19, TypeScript, and Vite. Pick an ingredient, choose a cuisine, and get a recipe suggestion — with like/dislike feedback stored locally.

---

## Getting started

```bash
nvm use lts/jod        # Node 22.12+ required
npm install
npm run dev       # http://localhost:5173
```

### Other commands

| Command                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `npm run build`         | Production build (TypeScript check + Vite bundle) |
| `npm run preview`       | Preview production build locally                  |
| `npm test`              | Run tests in watch mode                           |
| `npm run test:coverage` | Run tests with coverage report                    |
| `npm run lint`          | ESLint                                            |
| `npm run format`        | Prettier                                          |

---

## How it works

1. **Step 1 — Ingredient**: type in the autocomplete field to search for an ingredient (e.g. "chicken", "tomato"). The list is fetched from TheMealDB and filtered as you type, with prefix matches ranked first.
2. **Step 2 — Cuisine**: choose a cuisine area. Only areas that actually have at least one recipe matching the chosen ingredient are shown, preventing dead-end searches.
3. **Result**: a recipe from the intersection of ingredient + area is displayed. You can rate it 👍 / 👎 or ask for another idea. Both actions save an entry to history.
4. **History**: view all rated recipes. Each entry shows the ingredient + area context, the feedback, and a timestamp.

---

## Design decisions

### Vite and Vitest

The project uses Vite as the build toolchain. Compared to webpack-based setups, Vite's dev server starts in milliseconds because it serves source files as native ES modules during development rather than bundling everything upfront. For production, it uses Rollup under the hood and handles minification, tree-shaking, code splitting, and asset hashing out of the box — things that would each require explicit configuration in a webpack setup. The overall config is also significantly leaner.

For testing, Vitest was a natural fit: it runs inside the same Vite pipeline, meaning the same TypeScript config, the same module resolution, and the same aliases work without any extra setup. The alternative — Jest — would have required a separate Babel or `ts-jest` configuration to handle ES modules and TypeScript, and it's easy to end up with subtle differences between how code runs in tests and how it runs in the browser.

### TanStack Query

All network calls go through TanStack Query rather than plain `fetch` + `useEffect`. The core reason is the cache: ingredient and area lists are both static reference data, so they're prefetched once on startup with `staleTime: Infinity` and never re-fetched. Per-filter results (e.g. all meals that contain chicken) are also cached, so the second time a user visits the same combination the app responds instantly.

Beyond caching, TanStack Query handles the loading/error/data lifecycle in a predictable way. Managing that manually with `useEffect` means writing the same boilerplate in every component that touches the network, and being careful about cleanup to avoid setting state on unmounted components.

### State and persistence

The app has two kinds of state that need different treatment. Wizard selections (ingredient and area) are session-scoped: they're transient, and losing them on page refresh is expected. They live in plain `useState`. History entries, on the other hand, are user data that should survive navigation and refresh, so they're saved to localStorage.

There's no global state manager like Redux or Zustand. Remote data is covered by TanStack Query; local UI state is either component-level `useState` or localStorage. Adding a dedicated state library on top would have been complexity for its own sake.

### Design system

All visual constants — colours, radii, shadows, and spacing anchors — are declared as CSS custom properties in `:root` (`index.css`). Component modules reference tokens (`var(--color-accent)`, `var(--shadow-md)`, etc.) and never hard-code values. This means a brand change touches one file.

The `Button` component exposes three intent-based variants: `primary`, `secondary`, and `danger`. Variants map to universal UI patterns regardless of content. Buttons with domain-specific appearance (e.g. the like/dislike feedback buttons in `ResultPage`) use raw `<button>` elements with local module CSS — they're contextual, not generic, so they don't belong in the shared component.

### Error handling

An `ErrorBoundary` class component is colocated in `App.tsx`. It wraps the entire router tree and renders a fallback UI for any uncaught render-time error in child components. Network errors from API calls are handled at the component level via TanStack Query's `isError` state.

### UX and accessibility

The ingredient field is implemented as a custom ARIA combobox instead of a native `<datalist>`. The main limitations of `<datalist>` are that it can't be styled consistently across browsers and it doesn't allow controlling how suggestions are sorted. Sorting matters here: if you type "ch", you want "Chicken" at the top, not wherever it falls alphabetically. The custom implementation follows the WAI-ARIA combobox pattern — `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role="listbox"` and `role="option"` on the dropdown — with full keyboard navigation and auto-scroll on the active item.

The area selector uses a native `<select>`, which is accessible by default and appropriate given that it's a simple single-choice list with no sorting requirement. It only shows areas that have at least one recipe matching the selected ingredient, preventing users from reaching a "no results" dead end. During the area-filtering step, the select is replaced by a loading indicator (consistent with how `IngredientPicker` handles its own loading state), then replaced by the filtered select once results are ready.

### Recommendation logic

`selectMeal(meals, index)` returns the meal at the given index, or `null` if `index >= meals.length`. The `ResultPage` tracks `index` in state and increments it on each "New Idea" press; when it reaches the list length it shows an "all seen" message. There is no wrap-around: once the list is exhausted the behaviour is explicit rather than silently looping.

---

## Project structure

```
src/
  assets/          Static assets (placeholder image)
  components/      Shared UI components
                     NavBar, Button, FeedbackBadge
                     IngredientPicker, AreaPicker
                     RecipeCard, HistoryCard
  pages/           Route-level page components (WizardPage, ResultPage, HistoryPage)
  services/        API client (mealdb.ts), storage (storage.ts), recommendation logic (recommendation.ts)
  types/           TypeScript interfaces
  main.tsx         App entry — QueryClient setup + prefetch
  App.tsx          Router + layout + ErrorBoundary
```

---

## Data source

[TheMealDB](https://www.themealdb.com/) public API (v1, no key required).
