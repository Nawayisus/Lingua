## 2024-05-21 - Accessible Custom File Upload
**Learning:** Standard `<input type="file">` is hard to style consistent with design systems, but hiding it with `display: none` removes it from the accessibility tree, making it impossible for keyboard users to select files.
**Action:** Wrap the custom upload UI in a `<label for="fileID">` and use a `.visually-hidden` class on the input (not `display: none`). This keeps the input focusable. Add `:focus-within` to the label container to provide a visible focus ring when the hidden input is focused, ensuring keyboard users know where they are.
