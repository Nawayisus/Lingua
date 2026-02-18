## 2026-02-18 - Bootstrap Accessibility Gaps
**Learning:** The Bootstrap template used here lacks explicit `for` attributes on form labels and dynamic ARIA updates on progress bars, which are critical for screen reader users.
**Action:** Always manually verify and add `for` attributes to labels and implement `aria-valuenow` updates in JS when working with Bootstrap components in this project.
