## 2024-05-22 - Bootstrap Form Accessibility
**Learning:** Bootstrap form labels in this project are manually implemented without `for` attributes, breaking screen reader associations.
**Action:** Always check `index.php` for `label` tags and ensure they have a `for` attribute matching the input ID.

## 2024-05-22 - Dynamic Progress Feedback
**Learning:** The progress bar implementation only updates visual width, leaving screen readers unaware of status changes.
**Action:** Ensure `updateProgress` functions in `js/` explicitly update `aria-valuenow` alongside `style.width`.
