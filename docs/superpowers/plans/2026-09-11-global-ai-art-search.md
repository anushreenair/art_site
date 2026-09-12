# Global AI Art Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one global, responsive art search experience that searches Atelier's internal content first, supports natural-language filters and voice input, and optionally enhances results through a server-only Qwen integration.

**Architecture:** A reusable `GlobalSearch` component is mounted once in `AppShell`. `/search` renders results from a shared `src/lib/search.ts` internal index built from existing data modules. The browser performs deterministic parsing and ranking immediately; `/api/search` optionally calls Qwen with server-only environment credentials for conversational interpretation, ranking, learning answers, and current external sources.

**Tech Stack:** React 18, TypeScript, React Router 6, Vite, Vitest, Testing Library, lucide-react, Vercel-style TypeScript API function.

## Global Constraints

- Search existing website/database content first.
- Use one reusable search service/component; do not create page-specific search systems.
- Never expose or commit `QWEN_API_KEY`; use server environment variables only.
- Default Qwen endpoint is `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` and default model is `qwen-plus`.
- Keep existing artistic visual design and avoid unrelated page redesign.
- Voice recognition is one-shot and never continuously records.
- Internal search must work when Qwen is unavailable.
- Use direct actions and source links/citations for external current-information results.

---

### Task 1: Internal Search Domain

**Files:**
- Create: `src/lib/search.ts`
- Create: `src/lib/search.test.ts`

**Interfaces:**
- Produces `SearchDocument`, `SearchFilters`, `SearchResult`, `SearchTab`, `parseSearchQuery(query)`, `searchInternal(query, tab?)`, and `getSearchSuggestions(query)` for the UI and API layers.

- [ ] **Step 1: Write failing parser and ranking tests**

```ts
import { describe, expect, it } from 'vitest';
import { parseSearchQuery, searchInternal } from './search';

describe('parseSearchQuery', () => {
  it('extracts art filters from a conversational query', () => {
    expect(parseSearchQuery('I want to paint an easy flower in watercolor for 30 minutes')).toMatchObject({
      subject: 'Flowers', medium: 'Watercolour', difficulty: 'Beginner', durationMinutes: 30,
    });
  });

  it('recognizes current opportunity searches and locations', () => {
    expect(parseSearchQuery('Free art competitions in Mumbai this month')).toMatchObject({
      location: 'Mumbai', type: 'Opportunities', current: true,
    });
  });
});

describe('searchInternal', () => {
  it('ranks a matching reference ahead of unrelated content', () => {
    const results = searchInternal('beginner watercolor flowers 20 minutes', 'References');
    expect(results[0].title).toBe('Tulips in a glass');
    expect(results[0].actionLabel).toBe('View Reference');
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- src/lib/search.test.ts`
Expected: FAIL because `src/lib/search.ts` does not exist.

- [ ] **Step 3: Implement the normalized internal index and parser**

Build documents from `referenceStudies`, `recommendedPractice`, `currentLesson`, `challenge`, `learningPaths`, `masterStudies`, `opportunityListings`, `artworks`, and `categories`. Normalize lower-case tokens and aliases (`watercolor` to `watercolour`, `oil` to `oil painting`, `easy` to `Beginner`). Parse durations, cities, known subjects, media, skills, difficulty, tab/type terms, and current-language terms. Score exact title/phrase matches above metadata matches, apply filter matches, and return direct routes.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- src/lib/search.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit the focused domain slice**

```bash
git add src/lib/search.ts src/lib/search.test.ts
git commit -m "feat: add internal art search index"
```

### Task 2: Global Header Search UI

**Files:**
- Create: `src/components/GlobalSearch.tsx`
- Modify: `src/components/AppShell.tsx`
- Create: `src/components/GlobalSearch.test.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- `GlobalSearch` accepts no required props, navigates to `/search?q=...`, and exposes the required placeholder.

- [ ] **Step 1: Write the failing header interaction test**

```tsx
it('submits a query to the shared search route', async () => {
  const user = userEvent.setup();
  render(<MemoryRouter><GlobalSearch /></MemoryRouter>);
  await user.type(screen.getByPlaceholderText('Search what you want to draw, paint or learn…'), 'watercolor portrait');
  await user.keyboard('{Enter}');
  expect(screen.getByTestId('search-destination')).toHaveAttribute('href', '/search?q=watercolor+portrait');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/GlobalSearch.test.tsx`
Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the reusable header control**

Use `Search`, `Mic`, and `X` from `lucide-react`. Keep an input, submit button, microphone button, and a suggestion popover. Use `useNavigate` on submit, preserve editable text after speech, and include accessible labels. Add the component once to `AppShell` beside the wordmark/navigation without changing unrelated links.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/GlobalSearch.test.tsx`
Expected: PASS.

- [ ] **Step 5: Add scoped responsive styles and commit**

Add `.global-search` styles to `global.css`, with a desktop inline control and mobile full-width treatment inside the existing header breakpoint. Do not alter existing page selectors.

```bash
git add src/components/GlobalSearch.tsx src/components/GlobalSearch.test.tsx src/components/AppShell.tsx src/styles/global.css
git commit -m "feat: add global art search control"
```

### Task 3: Search Results Route and UI

**Files:**
- Create: `src/pages/SearchPage.tsx`
- Create: `src/pages/SearchPage.test.tsx`
- Create: `src/styles/search.css`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- `SearchPage` reads `q` with `useSearchParams`, calls `searchInternal`, renders tabs and actions, and preserves query in tab links.

- [ ] **Step 1: Write failing route and no-results tests**

```tsx
it('renders grouped internal results for a URL query', () => {
  render(<MemoryRouter initialEntries={['/search?q=watercolor+flowers']}><Routes><Route path="/search" element={<SearchPage />} /></Routes></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /search results/i })).toBeInTheDocument();
  expect(screen.getByText('Tulips in a glass')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'View Reference' })).toHaveAttribute('href', '/practice/ref-flowers');
});

it('offers recovery actions when there are no exact matches', () => {
  render(<MemoryRouter initialEntries={['/search?q=moon+made+of+glass']}><Routes><Route path="/search" element={<SearchPage />} /></Routes></MemoryRouter>);
  expect(screen.getByText('No exact match found.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Generate a Practice' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/pages/SearchPage.test.tsx`
Expected: FAIL because the route and page do not exist.

- [ ] **Step 3: Implement page, cards, tabs, filter chips, citations placeholder, and recovery state**

Render a progressive internal result list immediately. Use `Search` and `ArrowUpRight` icons, document action labels, and existing CSS variables. Tabs are accessible links/buttons and preserve `q`. Add route `/search` and import `search.css` from `main.tsx`.

- [ ] **Step 4: Run focused page tests**

Run: `npm test -- src/pages/SearchPage.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit route slice**

```bash
git add src/pages/SearchPage.tsx src/pages/SearchPage.test.tsx src/styles/search.css src/App.tsx src/main.tsx
git commit -m "feat: add art search results page"
```

### Task 4: Voice Search and Suggestions

**Files:**
- Modify: `src/components/GlobalSearch.tsx`
- Modify: `src/components/GlobalSearch.test.tsx`
- Modify: `src/lib/search.ts`

**Interfaces:**
- Speech recognition is created only after microphone activation, uses `continuous = false`, and writes final transcript into the input before navigation.

- [ ] **Step 1: Add failing voice and suggestion tests**

Test that unsupported browsers render no active microphone control, supported recognition shows `Listening...`, and `onresult` submits the final transcript. Test `getSearchSuggestions('water')` includes `Watercolor landscapes`.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- src/components/GlobalSearch.test.tsx src/lib/search.test.ts`
Expected: FAIL on the missing voice/suggestion behavior.

- [ ] **Step 3: Implement one-shot recognition and local suggestion groups**

Use `window.SpeechRecognition ?? window.webkitSpeechRecognition` through a narrow type declaration. Handle `onerror` for `not-allowed`, `no-speech`, and generic failures; clear listening state in `onend`; never set continuous mode. Use localStorage key `atelier.recent-searches`, cap at five entries, and provide static trending/suggested-for-you values.

- [ ] **Step 4: Run focused tests and verify pass**

Run: `npm test -- src/components/GlobalSearch.test.tsx src/lib/search.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit voice and suggestion slice**

```bash
git add src/components/GlobalSearch.tsx src/components/GlobalSearch.test.tsx src/lib/search.ts
git commit -m "feat: add voice search and suggestions"
```

### Task 5: Qwen Server Integration

**Files:**
- Create: `api/search.ts`
- Create: `api/search.test.ts`
- Modify: `vite.config.ts`
- Modify: `src/pages/SearchPage.tsx`
- Modify: `src/pages/SearchPage.test.tsx`

**Interfaces:**
- `POST /api/search` accepts `{ query: string, results: Array<{ id: string; title: string; type: string }> }` and returns `{ ok: boolean; intent?: SearchFilters; rankedIds?: string[]; relatedSearches?: string[]; answer?: string; sources?: SearchSource[]; external?: boolean; error?: string }`.

- [ ] **Step 1: Write failing API validation tests**

```ts
it('rejects empty or oversized queries without calling Qwen', async () => {
  const response = await invokeSearchApi({ query: '', results: [] });
  expect(response.statusCode).toBe(400);
});

it('returns a non-fatal fallback when the key is absent', async () => {
  const response = await invokeSearchApi({ query: 'watercolor portrait', results: [] });
  expect(response.statusCode).toBe(200);
  expect(response.body).toMatchObject({ ok: true });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- api/search.test.ts`
Expected: FAIL because the handler does not exist.

- [ ] **Step 3: Implement safe server-only Qwen handler and dev middleware**

Create the Vercel-compatible handler with request-body validation, `QWEN_API_KEY`, `QWEN_BASE_URL`, and `QWEN_MODEL` reads. Send a strict JSON-output prompt containing only query and compact internal result summaries. Mark external searches from current-information language and request source URLs/citations in that branch. Add a Vite dev middleware matching the existing auth middleware so local `/api/search` works. Never import server code into frontend modules.

- [ ] **Step 4: Run API tests to verify pass**

Run: `npm test -- api/search.test.ts`
Expected: PASS.

- [ ] **Step 5: Connect progressive enhancement to SearchPage**

After local results render, call `/api/search` only for non-empty queries. Apply safe ranked IDs, related searches, answer, and sources. Display a non-blocking enhancement error only when useful; retain local results otherwise.

- [ ] **Step 6: Run focused search tests and commit**

Run: `npm test -- api/search.test.ts src/pages/SearchPage.test.tsx`
Expected: PASS.

```bash
git add api/search.ts api/search.test.ts vite.config.ts src/pages/SearchPage.tsx src/pages/SearchPage.test.tsx
git commit -m "feat: add server-side Qwen search enhancement"
```

### Task 6: Full Validation and Review

**Files:**
- Modify only files with verified defects found during validation.

- [ ] **Step 1: Run the complete test suite**

Run: `npm test`
Expected: all existing and new tests pass.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: TypeScript compilation and Vite build exit with code 0.

- [ ] **Step 3: Review the diff and requirements**

Run: `git diff d2628d9 --stat` and inspect search files. Confirm no auth/Neon files were modified by this feature, credentials are environment-only, and the required routes/tabs/actions/voice states/no-results actions exist.

- [ ] **Step 4: Run the dev server smoke test**

Run: `npm run dev -- --host 127.0.0.1`
Use the existing browser QA tooling to open `/search?q=watercolor+flowers`, confirm the header search, result card, tabs, and mobile layout. Stop the server after the smoke test.

- [ ] **Step 5: Commit only verified fixes**

```bash
git add <verified-search-files>
git commit -m "test: verify global art search"
```
