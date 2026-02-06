## 2024-05-23 - Accessible Drop Zone Pattern
**Learning:** Standard file inputs are ugly, but custom drop zones are often inaccessible. Using a `<label>` as the drop zone container with a `.visually-hidden` file input inside allows for native click-to-upload behavior without JavaScript. Using `:focus-within` on the container allows for proper keyboard focus indication when the hidden input is focused.
**Action:** Apply this `label` + `visually-hidden` + `:focus-within` pattern to all future custom file upload components.
