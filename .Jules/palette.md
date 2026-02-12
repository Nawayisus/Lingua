## 2026-02-21 - [Unassociated Form Labels in Bootstrap Templates]
**Learning:** This project uses a Bootstrap 5 template structure where `label` elements are visually placed above inputs but lack the `for` attribute or nesting required for programmatic association. This creates a barrier for screen reader users who may not know which label corresponds to which input.
**Action:** When working with this codebase or similar Bootstrap templates, always check for and add explicit `for` attributes linking labels to their input IDs.
