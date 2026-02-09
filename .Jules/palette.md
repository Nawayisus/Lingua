# Palette's Journal

## 2024-05-23 - Accessible File Upload Pattern
**Learning:** Using a `<label>` wrapping a `.visually-hidden` file input allows for fully accessible, custom-styled upload zones without complex JS, leveraging native `:focus-within` behavior.
**Action:** Prefer this semantic HTML structure over `div` + `onclick` handlers for custom form controls to ensure keyboard accessibility and robustness.
