---
'@constructor-lab/ui-react': patch
---

fix(search-global): re-theme off the removed `--ui-search-global-*` tier

`SearchGlobal` is retired (deprecated, slated for removal) and its dedicated
component token tier was removed from `@constructor-lab/tokens` — but the
component still referenced 15 of those tokens plus two generated
`.ui-search-global-*-text-style` classes that went with them. Every one of those
`var()` lookups resolved to nothing, so the field rendered with no fill, size,
radius, gradient border, or text colors.

Each reference now points at the shared token that tier used to alias — the AI
gradients, the `--ui-units-*` sizes, and the AI-purple glyph/text semantics — so
the field resolves through generated tokens again and renders as designed. The
two text-style classes become their equivalent utilities. No component tier is
reintroduced, and its `ui-spec` `tokens.yaml`/anatomy/accessibility/README are
updated to name the tokens that actually exist.
