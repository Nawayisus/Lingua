## 2026-02-17 - [Accessible Form Controls]
**Learning:** Bootstrap form labels in this project were missing `for` attributes, breaking explicit association for screen readers. Progress bars also lacked `aria-valuenow` updates.
**Action:** Always manually verify `for` attributes on Bootstrap labels and ensure dynamic components like progress bars update ARIA states in JS.
