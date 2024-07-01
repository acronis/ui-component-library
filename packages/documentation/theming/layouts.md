# Layouts

Container components for scaffolding basic structure of the page:

`<acv-container>`: wrapper container. When nested with a `<acv-header>` or `<acv-footer>`, all its child elements will be vertically arranged. Otherwise, horizontally.

`<acv-header>`: container for headers.

`<acv-aside>`: container for side sections (usually a side nav).

`<acv-main>`: container for main sections.

`<acv-footer>`: container for footers.

:::tip
These components use flex for layout, so please make sure your browser supports it. Besides, `<acv-container>`'s direct child elements have to be one or more of the latter four components. And father element of the latter four components must be a `<acv-container>`.
:::

## Common layouts

<LayoutBasic/>
