## 2024-05-22 - Missing Form Label Associations
**Learning:** The application consistently uses `<label>` elements visually adjacent to form controls but lacks the `for` attribute or explicit nesting to associate them programmatically. This is a recurring pattern that needs systematic correction.
**Action:** When touching form files, check for and add `for` attributes to labels or use implicit nesting to ensure screen reader accessibility.
