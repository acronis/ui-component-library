---
'@constructor-lab/ui-react': patch
---

fix(page-header): PageHeader is no longer a `banner` landmark

`PageHeader` rendered `role="banner"`, which added a second `banner` landmark
alongside the app header on every screen — an ARIA landmark-uniqueness violation
(and it made the screen-audit conflate the two headers). It is now a
non-landmark `<div>`; the page's sole `banner` is the app header, and the `<h1>`
in `PageHeaderTitle` remains the page heading. Enforced by the new
`accessibility/landmark-uniqueness` grammar rule (I6, `must`).
