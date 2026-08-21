---
'@constructor-lab/ui-react': patch
---

**Toast**: the title renders through its own tier class again, instead of a
semantic class that no longer exists.

`ToastPrimitive.Title` hardcoded `.ui-typography-headings-heading`. That style
has been deleted from Figma and `@constructor-lab/tokens` no longer emits the
class, so the title was falling back to inherited typography — no font-family,
size, weight, line-height or letter-spacing of its own.

The hardcoding was a documented workaround: the tier's own
`content/textContainer/title/textStyle` used to carry a Figma hint naming a
token that did not exist, so the emitter dropped it and left the title unbound.
That hint has since been corrected upstream, so the title now uses
`.ui-toast-global-content-text-container-title-text-style` — the same shape the
description already used, and re-pointable per brand rather than pinned to a
shared semantic style. It resolves to `18px / 400` via
`typography.headings.lead`.

Nothing caught this: no unit test, lint rule or spec check asserts that a class
a component names actually exists in the token output. The six Toast visual
baselines did not catch it either — the stories screenshot `fullPage`, so the
title's contribution landed under the committed `failureThreshold` of `0.005`.
They are regenerated here with the scoped `VISUAL_FAILURE_THRESHOLD=0` override
that `.storybook/test-runner.ts` prescribes for exactly this case.
