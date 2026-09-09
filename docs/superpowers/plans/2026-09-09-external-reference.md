# Add External Reference — Step A

Goal: Add a complete URL → editable preview → private saved link flow to Atelier.
Architecture: React routes use a typed reference module for URL validation, replaceable placeholder metadata, and versioned browser storage. No external fetches or image copying. Keep existing changes and styles intact.

Design: Existing Instrument Serif headings, DM Sans body, DM Mono labels, parchment/chalk surfaces and ink borders. A two-column page puts editable details beside a large thumbnail-unavailable card. On mobile these stack. Source labels and original-link actions preserve attribution. No fabricated creator or image.

Decisions: A dedicated page gives the form more room than a modal. Browser-local storage matches this prototype. Only Source URL is required. Private and Rights Unknown are fixed defaults. Basic saved-link retrieval closes the Step A save loop; classification, collections behavior, editing saved records, sharing, and practice integration remain later steps.

- [x] Test the user journey from Explore through save and remount; unsafe links, manual corrections, cancel, source changes, and storage errors.
- [x] Implement src/lib/externalReferences.ts: HTTP(S) public-host validation, HTTPS normalization, exact-domain source detection, text-only metadata, versioned localStorage.
- [x] Implement AddExternalReferencePage and ExternalReferencePreview: source input, editable preview, source reset, success and add-another.
- [x] Implement SavedExternalReferencesPage and entry points in navigation, Explore, generator, profile saved and collections sections.
- [x] Add scoped responsive CSS matching Atelier.
- [x] Run final tests/build and apply checked files to art_app.

Security: No fetch, hotlinked images, iframe or arbitrary HTML. Reject IP literals, local/reserved hostnames, credentials, unsupported schemes and ports. Client validation is not server SSRF protection: a future backend must validate DNS and each redirect and honor source restrictions independently.
Persistence: Private means local to this browser, not authenticated account isolation or synced storage. Storage errors preserve drafts and never overwrite malformed existing data. Original source uses HTTPS where possible; paths, queries and fragments are retained. Placeholder canonical URL equals the normalized source, not a publisher-verified canonical.

Verification: 89 tests in 37 files passed, and npm run build passed in art_app. Desktop entry/preview/save flow inspected in Chrome. Mobile entry checked at 390px; save, original attribution, and persistence after reload verified in Chrome. No browser console errors. git diff --check passed. Temporary preview server stopped after verification.
