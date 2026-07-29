---
'@constructor-lab/ui-react': patch
---

`Table`: `height` and `maxHeight` require a **definite** length, and a percentage
now says so in development.

A percentage never bounded the scroll container, and after the constraint moved to
the element that scrolls it stopped even _looking_ bounded. Measured for both
members — 60 rows, `50%`, a 400px parent — the scrolling element comes out 2440px
with `scrollHeight === clientHeight` and `scrollTop` stuck at 0. Percentages
resolve against that element's containing block, whose height is `auto`, so they
compute as no constraint at all.

**A percentage previously appeared to work, and that is the part worth stating.**
When the constraint sat on the outer box it resolved against the app's own
definite-height parent, so the box came out the right size and **clipped** its
overflow. It was never scrolling; it only looked bounded. A layout that has just
started overflowing was showing you clipped content before.

Use a length (`320`, `'20rem'`) or a viewport unit (`'50vh'`). A percentage logs a
development-only error naming the prop and the value.

No behaviour change for any definite value, and nothing in this repo passed a
percentage.
