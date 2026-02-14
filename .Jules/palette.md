## 2024-05-23 - Accessibility in Dynamic UI
**Learning:** This application uses a centralized `UI` object in `js/app.js` to manage DOM elements. This is an excellent place to hook in accessibility updates (like `aria-valuenow`) alongside visual updates.
**Action:** When modifying UI state, always look for the corresponding update function in `js/app.js` and add ARIA attribute updates there.

## 2024-05-23 - Bootstrap Form Labels
**Learning:** The Bootstrap form implementation here frequently misses `for` attributes on labels, relying on visual proximity.
**Action:** Always check and add `for` attributes when touching form components to ensure screen reader compatibility.
