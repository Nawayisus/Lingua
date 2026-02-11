## 2026-03-05 - Missing Form Label Association in Bootstrap Templates
**Learning:** Bootstrap templates often use `<label class="form-label">` for styling without the crucial `for` attribute linking it to the input's `id`. This breaks accessibility for screen readers and keyboard users (clicking label doesn't focus input).
**Action:** Always verify `for` attributes on labels in Bootstrap-based projects, even if they look visually correct.
