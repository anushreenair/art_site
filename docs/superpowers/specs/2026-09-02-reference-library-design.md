# Atelier Reference Library Design

## Purpose

Create an intentional reference library where artists find a precise, practical study to make next. The experience is a reference desk—not a social feed—and every visual decision supports narrowing down to a viable practice session.

## Recommended approach

Use a **precision-first reference desk**:

- Desktop: a persistent, compact filter rail on the left with visible groups for Difficulty, Subject, Medium, Skill, and Time.
- Mobile: the filter rail becomes a modal/drawer opened by one clear Filter control that displays the active-filter count.
- Main area: a responsive editorial grid showing results, a concise current-query summary, sort control, and one contextual prompt rather than endless discovery sections.

This approach prioritizes artists who know what they need to practise while keeping entry approachable through curated quick-start chips (Portrait, 20 min, Lighting, Beginner).

## Page layout

1. **Reference desk header:** page title, one-sentence guidance, and a Search references input.
2. **Quick-start row:** compact filter chips representing common practice intentions.
3. **Filter rail / filter drawer:** grouped multi-select filters; each group is collapsible below the first three visible options. `Clear all` appears only with active filters.
4. **Results bar:** result count, active filter pills, and sort choice (`Best for you`, `Shortest study`, `Most attempted`).
5. **Reference grid:** a dense but breathable masonry-like grid of reference cards; no unrelated community feed or recommendations interrupting results.
6. **Practice nudge:** after the first row, a quiet banner says what the selected filters are good for and offers `Start a focused session`.

## Data and interaction model

Extend the local typed data layer with `ReferenceStudy`:

```ts
type ReferenceStudy = {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
  subject: Subject;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  medium: Medium;
  time: Time;
  skills: Skill[];
  attempts: number;
  rights: 'Public domain' | 'Artist licensed' | 'Practice reference';
};
```

Filter state remains local in Phase 2 and is derived directly during render: no server fetches, effects, or persistence. Multi-select intersections use OR within a group and AND across groups. Search matches title, subject, medium, and skill labels. A subsequent backend can replace the static study export with a repository function returning the same shape.

## Reference cards

Each card has image-led hierarchy, followed by a readable metadata strip containing subject, difficulty, recommended medium, estimated practice time, skills practised, attempted count, and a rights badge. Its four actions are always available without hover-only reliance:

- `Start Practice` opens the existing local preparation surface for the study’s subject.
- `Save` toggles saved state locally and announces it accessibly.
- `Add to Collection` opens a small local menu with believable collection names.
- `Preview` opens a local dialog with a larger image and full study metadata.

## Visual identity

The library follows the editorial-reset direction: gallery white field, night-ink type, electric-coral primary action, cobalt active filters, and no paper texture or soft dashboard cards. Filters behave like physical index tabs—crisp labels, selected-state fill, and intentional spacing. Artwork remains large and unmasked; grid cards vary only by image ratio, not decoration.

## Accessibility, loading, and empty states

- Filter groups use native buttons with `aria-expanded`; selected filter controls expose pressed state.
- A results status region announces the resulting count after filter changes.
- Dialog focus is trapped and return focus is restored on close.
- Empty state: “No studies match this desk yet.” with `Clear filters` and quick-start suggestions.
- A future loading state uses five non-animated, text-labelled placeholder cards; Phase 2 static data renders immediately.

## Verification

- Test group filtering, group intersection behavior, clear filters, result count, saved state, and preview dialog.
- Verify each card exposes every requested metadata field and action by accessible name.
- Run the complete test suite and production build.
- Check the filter rail at desktop and drawer layout at mobile after browser access becomes available.

## Scope boundary

Phase 2 adds the Explore route and local interaction only. It excludes external image search, live licensing verification, cloud collections, authentication, uploads, and recommendation APIs.
