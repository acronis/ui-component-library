---
---

Replace the deprecated `React.ElementRef` type alias with `React.ComponentRef`
across ui-react. Type-only and behavior-identical (`ElementRef` is defined as an
alias of `ComponentRef` in React 19's types), so there is no public-API or
runtime change and no release is required — this is an intentionally empty
changeset to record that decision.
