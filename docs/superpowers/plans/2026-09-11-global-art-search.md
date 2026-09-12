# Global Art Search Implementation Plan

**Goal:** Deliver the approved universal search and verify it in agent-browser.
**Architecture:** Shared catalog and parser provide immediate results. A server-only Qwen handler enhances them and conditionally retrieves cited web information.
**Tech stack:** Existing React, TypeScript, Vite, Vercel, Vitest; browser SpeechRecognition.

## Constraints
Preserve unrelated UI and uncommitted changes. Follow the user's exact stage order. Never put provider credentials in browser code or source control. Use real content and honest fallback states.

## Ordered tasks
- [ ] 1. Add `GlobalSearch.tsx` to `AppShell.tsx`; test keyboard submission to `/search?q=`.
- [ ] 2. Add `SearchPage.tsx`, route, category controls and scoped `search.css`; verify a direct URL renders.
- [ ] 3. Add `search/types.ts`, `catalog.ts`, `service.ts`; adapt existing datasets and saved references. Verify actual matches and no-match behavior, then add destination query/anchor support.
- [ ] 4. Add `search/intent.ts`; test flower/watercolor/easy/time extraction, aliases, locations, free opportunities and freshness detection.
- [ ] 5. Add `useVoiceSearch.ts`; test final transcript, stop, permission/no-speech errors and cleanup.
- [ ] 6. Add `api/search.ts` and shared development middleware. Validate Qwen parsing/ranking, timeouts, missing credentials and malformed responses using mocked HTTP boundaries.
- [ ] 7. Enable official Qwen web search only for external/current intent or explicit web requests. Test citation metadata, safe URLs, no-source fallback and ordinary query web exclusion.
- [ ] 8. Add local autocomplete/history/personalization and keyboard navigation; test storage recovery and selection.
- [ ] 9. Check all stages with `npm test`, `npm run build`, and desktop/mobile agent-browser flows. Fix reproduced problems, inspect credential separation, document setup and actual live-provider verification status.

## Acceptance checks
`npm test -- src/components/GlobalSearch.test.tsx src/lib/search/search.test.ts api/search.test.ts`
`npm test`
`npm run build`
Browser: search the supplied conversational examples, select categories, follow cards, edit queries, use browser back, clear history, inspect 390px layout, capture runtime errors.
