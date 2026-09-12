# Global art search

## Scope and approach

Implement one reusable search component in the existing `AppShell`, one `/search?q=` route, and one universal search service. Preserve the existing parchment, clay, ink, typography, and page layouts. Only change destination pages where needed to open the specific result or prefill practice filters.

Recommended approach: index the existing content modules with a shared, typed adapter and progressively enhance results through a server-only Qwen endpoint. This uses the app's actual content immediately, works without an AI key, and fits its Vite/React and Vercel architecture.

Alternatives considered: moving all content into Postgres would require an unrelated content migration; making Qwen responsible for every result would increase latency and make basic navigation dependent on an external service. Neither is needed for this feature.

## Existing content

Reference studies, practices, learning paths and lessons, master studies, challenges, and opportunities already exist in `src/data`. Community posts currently live inside `CommunityPage`; move their data into a shared module without changing their rendering. Saved external references live in browser storage and can be included locally, without sending their private contents to Qwen. The current database contains account records, not a searchable art catalog. Never index account credentials or treat user accounts as public community content.

## UI and routing

The header search uses the exact placeholder “Search what you want to draw, paint or learn…”, a search action, and a supported-browser microphone action. It remains available with the mobile navigation closed. Mobile search may expand into a full-screen dialog with focus management, Escape dismissal, and focus restoration.

Submitting navigates to `/search?q=<encoded query>`. The URL is the source of truth for the query and supports reload and back/forward navigation. Show categories All, References, Practice, Learning, Masters, Challenges, Community, and Opportunities with counts and useful metadata. Use accessible category controls rather than incomplete ARIA tab semantics.

Cards use real content IDs and route to the exact reference, practice, lesson, master study, challenge, post, or opportunity. Add query-parameter or anchor support to existing destinations where they currently cannot select a specific record. Actions include Start Practice, Open Lesson, View Reference, Join Challenge, and View Opportunity. Starting from a search carries supported subject, medium, difficulty, skill, and duration into the practice builder.

## Universal service

Normalize content into documents with stable IDs, category, title, description, searchable keywords, optional image, structured metadata, and destination/action. Keep catalog adapters, query parsing, matching/ranking, and AI transport behind a shared service interface.

Return the original query, parsed filters, exact results, separately labelled related results, suggested searches, optional learning answer, verified web sources, and service status. Do not replace real catalog records with model-invented records. Accept reranking only for candidate IDs supplied by the service; discard unknown IDs and preserve valid omitted candidates.

First run local parsing and internal matching. Extract subject, medium, difficulty, skill, duration, location, content type, free-entry intent, and freshness intent. Normalize singular/plural forms and common aliases, including watercolor/watercolour and easy/beginner. For the flower example, extract Flowers, Watercolour, Beginner, and 30 minutes. Treat duration as a maximum practice budget unless the wording specifies an exact duration. Unknown words still contribute to text matching rather than returning every record.

Exact results satisfy explicit constraints when the metadata supports them. Relax constraints only in the labelled related section; do not imply that a charcoal result is watercolor or that an expired competition is currently open.

## Qwen backend

Add a server-only search endpoint under `api` and a Vite development middleware that invokes the same handler. Store credentials in `QWEN_API_KEY` or the provider-standard `DASHSCOPE_API_KEY`, with server-only endpoint/model configuration for the user's provider region. Never use a `VITE_` credential, import backend code into the browser, log secrets, or commit secret values. Document placeholder environment variables and local/production setup.

Qwen refines conversational filters, proposes related searches, reranks real candidates, and answers art-learning questions. Validate model output against known types, constrain input/output size, set request deadlines, and return safe fallback status on missing credentials, invalid JSON, provider errors, or timeouts. Render generated text as text, never raw HTML. Cancel superseded browser requests and ignore stale responses.

Internal results appear immediately. After Qwen refines intent, rerun the same internal matching service and apply valid ranking suggestions. Send only the query and necessary public catalog context to the provider, not private saved references or search history.

## Current information and citations

Ordinary searches such as “watercolor portrait” never enable web search. Current competitions, exhibitions, open calls, time-sensitive location searches, or an explicit Search the Web action may enable it, after the internal search has run. “Near me” requires a user-provided city when no usable saved location exists; never invent a location or silently request geolocation.

Use Qwen's official web search, not model knowledge presented as live retrieval. Alibaba documents `enable_search` and source options at https://www.alibabacloud.com/help/en/model-studio/web-search. Select a compatible configured model and API, request returned source metadata, and map citations to actual provider-returned sources. Restrict source URLs to HTTP(S), show source titles/links and retrieval status, and never manufacture citations. If sources are absent, explain that current information could not be verified while keeping internal results visible. Resolve “this month” using the current date, not dates embedded in seed content.

## Voice

Feature-detect SpeechRecognition/webkitSpeechRecognition. Start a single non-continuous recognition session only on a microphone click. Display Listening…, allow explicit stop, populate editable text, and submit the finalized transcript when recognition ends. Empty or failed recognition must not submit. Handle denied permission, no speech, unsupported browsers, audio/device errors, and network errors with concise accessible feedback. Abort and clean up on unmount; do not restart automatically. Explain that supported browsers may use a speech service to transcribe audio.

## Suggestions and history

Provide keyboard-operable autocomplete with Arrow keys, Enter, Escape, pointer selection, and an accessible active option. Use local catalog suggestions while typing; avoid a provider call per keystroke. Add Qwen-related suggestions after submitted searches. Store a bounded, deduplicated recent-search list locally with Clear history and graceful handling of unavailable or corrupt storage.

Show Suggested For You using available local interests/history; fall back to broad art suggestions. Since the app has no global search analytics, label initial Trending Searches as curated suggestions rather than claiming measured popularity. Include the requested starter searches. Private history remains on the device.

## Empty, loading, and error states

For no exact results show “No exact match found.” with related references, similar practice sessions, Generate a Practice, and Search the Web. Preserve any locally available cards while AI loads or fails. Provide a retry action where appropriate and distinguish unavailable AI from zero results. Blank queries display discovery suggestions. Respect reduced motion, maintain visible focus, and prevent narrow-screen overflow.

## Implementation sequence and verification

Follow the requested sequence, with each stage functional before the next:

1. Shared header search UI and submission.
2. `/search` route and grouped result presentation.
3. Shared internal index/filtering and working result destinations.
4. Natural-language parsing and displayed filters.
5. Voice input and lifecycle/error handling.
6. Qwen backend parsing, ranking, related queries, and learning answers.
7. Conditional official live web search and citations.
8. Autocomplete, bounded history, and personalized/curated suggestions.
9. Responsive/accessibility polish and failure states.

Test representative natural queries, aliases, duration budgets, unmatched terms, category filtering, deep-link actions, query navigation, voice completion/stop/errors, corrupt storage, superseded requests, missing credentials, invalid AI output, unknown result IDs, conditional web invocation, and citation URL validation. Run the existing suite and production build. Inspect desktop/mobile search in a browser. Verify that server credentials are absent from the client bundle. A successful live provider call depends on a correctly configured key, region, and model; report separately whether it was actually exercised.
