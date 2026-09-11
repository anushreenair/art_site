# Global AI Art Search Design

## Goal

Add one universal search experience across Atelier that finds existing internal content first, understands natural-language art requests, supports voice input, and optionally uses Qwen on the server for conversational interpretation, ranking, art-learning answers, and current external information.

The existing visual language remains unchanged outside the search surfaces.

## Scope

The feature includes:

- A prominent global search control in `AppShell`, available on every existing app page.
- A responsive `/search?q=` results page with category tabs:
  `All`, `References`, `Practice`, `Learning`, `Masters`, `Challenges`, `Community`, and `Opportunities`.
- One internal search service over the existing website data.
- Local natural-language parsing for common art filters.
- Optional server-side Qwen enhancement through `/api/search`.
- Browser speech recognition with graceful fallback.
- Suggestions, recent searches, trending searches, and suggested searches.
- Useful no-results actions.

The feature does not redesign unrelated pages, create per-page search implementations, expose API credentials, or require external web search for ordinary internal queries.

## Architecture

### Search flow

```text
User query
  -> GlobalSearch input
  -> /search?q=...
  -> local intent parser
  -> internal content index
  -> local scoring and grouping
  -> optional /api/search enhancement
  -> SearchPage results, suggestions, or answer
```

The browser owns navigation, input state, speech recognition, local recent-search persistence, and rendering. The shared search service owns searchable document construction, parsing, filtering, scoring, grouping, and fallback suggestions.

The backend owns all Qwen requests. `QWEN_API_KEY` is read only from the server environment. `QWEN_MODEL` is configurable and defaults to `qwen-plus`. The DashScope OpenAI-compatible endpoint is configurable through `QWEN_BASE_URL` and defaults to the international compatible-mode endpoint.

## Search data model

The internal index normalizes existing data into a common document shape:

- `id`
- `type`
- `title`
- `description`
- `metadata`
- `searchText`
- `imageUrl` when available
- `actionLabel`
- `actionTo`

Documents are generated from existing reference studies, practice data, learning paths and lessons, master studies and activities, challenges, community content where available, and opportunity listings. No duplicate page-specific search logic is introduced.

Search intent is represented as optional filters:

- subject
- medium
- difficulty
- skill
- duration in minutes
- location
- content type
- current/external information requested
- original query

The local parser handles known terms, aliases such as `watercolor`/`watercolour`, durations, difficulty terms, skills, cities, and content-type language. It must remain deterministic and usable without Qwen.

## Results and ranking

Internal matching uses normalized token and phrase matching across title, description, metadata, and skills. Exact title and filter matches receive the highest score, followed by subject, medium, skill, and general text matches. Results are grouped by the requested tab and expose direct actions:

- `View Reference`
- `Start Practice`
- `Open Lesson`
- `Study Master`
- `Join Challenge`
- `View Opportunity`
- `Open Community`

Qwen may return parsed intent, related searches, a reordered result-id list, or an art-learning answer. The client only applies result IDs that exist in the internal index and falls back to local ranking for malformed or unavailable responses.

Queries asking for current competitions, exhibitions, open calls, or nearby opportunities are marked external. The backend may use Qwen's official web-search capability for those queries and returns source title, URL, and citation metadata. External results are visually separated from internal results and never silently replace them.

## Global search UI

`GlobalSearch` is rendered once inside `AppShell` and links to `/search?q=...` on submit. It includes:

- search icon
- large accessible input with the required placeholder
- microphone button when `SpeechRecognition` or `webkitSpeechRecognition` exists
- keyboard-friendly suggestion popover
- recent, trending, and suggested query sections when the input is focused
- a listening state and clear error states

Voice behavior:

1. Request microphone access through browser speech recognition.
2. Show `Listening...` while active.
3. Put the final transcript in the editable input.
4. Submit automatically when recognition ends after a successful result.
5. Stop after one recognition session; continuous recording is never enabled.
6. Handle permission denial, no-speech, recognition errors, and unsupported browsers without disabling typing.

On narrow screens the search route presents a full-width focused search experience; the header remains compact and existing navigation behavior is preserved.

## Search page

`SearchPage` reads `q` from the URL so searches are shareable and browser navigation works. It renders:

- query heading and extracted filter chips
- category tabs preserving the query
- grouped result sections or a unified result list
- loading state for optional backend enhancement
- source citations for external results
- related searches
- an art-learning answer when Qwen returns one
- smart no-results state with `Related references`, `Similar practice sessions`, `Generate a Practice`, and `Search the Web`

The internal result view renders immediately. Qwen enhancement is progressive and must not block useful internal results.

## Backend API

Add `api/search.ts` following the existing Vercel function style. It accepts a JSON payload containing the query and optional internal result summaries. It validates query length and limits payload size.

The handler:

- returns a safe local-compatible response for empty or invalid requests
- detects whether external/current information is needed
- calls Qwen only when enhancement is useful
- uses a strict JSON response shape
- never returns the API key or raw confidential environment data
- handles timeout, non-2xx, malformed JSON, and missing-key cases with a non-fatal response

The frontend treats the API as optional. A missing key, network failure, or Qwen failure leaves internal results and local suggestions usable.

## Testing

Add focused tests for:

- normalization and aliases
- intent extraction from example queries
- internal filtering and ranking
- category grouping and direct action URLs
- smart no-results suggestions
- recent-search persistence behavior
- search route rendering and query changes
- global header submission
- voice unsupported and recognition-error behavior where the test environment permits
- backend request validation and safe missing-key behavior

Run the existing full test suite and production build after implementation.

## Acceptance criteria

- The search bar is reachable from every existing route through the shared header.
- The required placeholder is present.
- `/search?q=` renders useful internal results for natural-language examples.
- Filters expose subject, medium, difficulty, time, skill, location, and type when detected.
- Results provide direct actions and category tabs.
- Voice input is one-shot, editable, auto-submitting, and gracefully unsupported.
- Qwen is called only from server code and credentials remain environment-only.
- Current-information searches can display source links/citations when Qwen web search succeeds.
- Internal search remains functional without Qwen.
- No unrelated page redesign is introduced.
