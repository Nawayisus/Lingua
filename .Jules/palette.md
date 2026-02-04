## 2026-02-04 - Dropzone Interaction Pattern
**Learning:** Users expect dashed "drop zones" to be fully clickable, not just the button inside them.
**Action:** Always add `onclick` handler to the dropzone container that triggers the file input, while keeping the button for keyboard accessibility.
