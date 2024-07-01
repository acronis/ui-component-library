# Typography

Typography is important part of design system. 
It helps to create visual hierarchy and make content more readable.

## Font faces

UI components use three font faces:
- **Opens sans** for regular text
- **Roboto Mono** for code snippets
- **Inter** for headings

## Heading styles

<h1 class="acv-h1">Heading 1</h1>

<h2 class="acv-h2">Heading 2</h2>

<h3 class="acv-h3">Heading 3</h3>

<h4 class="acv-h4">Heading 4</h4>

<h5 class="acv-h5">Heading 5</h5>

## Text styles

<div class="acv-text">Basic text</div>

<div class="acv-text--display-large">Display Large</div>

<div class="acv-text--display-medium">Display-medium</div>

<div class="acv-text--display-regular">Display-regular</div>

<div class="acv-text--heading">Heading</div>

<div class="acv-text--strong">Strong</div>

<div class="acv-text--subheading">Subheading</div>

<div class="acv-text--caption">Caption</div>

<div class="acv-text--accent">Accent</div>

<div class="acv-text--body-xl">Body-XL</div>

<div class="acv-text--body-lg">Body-LG</div>

<div class="acv-text--body-regular">Body-Regular</div>

## Font weights

<div class="acv-text--weight-regular">Regular</div>

<div class="acv-text--weight-accent">Accent</div>

<div class="acv-text--weight-bold">Bold</div>

## Font sizes

<div class="acv-text--size-fineprint">Fineprint</div>

<div class="acv-text--size-note">Note</div>

<div class="acv-text--size-caption">Caption</div>

<div class="acv-text--size-body">Body</div>

<div class="acv-text--size-accent">Accent</div>

<div class="acv-text--size-lead">Lead</div>

<div class="acv-text--size-title">Title</div>

<div class="acv-text--size-display">Display</div>

## Line heights

<div class="acv-text--height-x-small">Compact</div>

<div class="acv-text--height-small">Normal</div>

<div class="acv-text--height-regular">Regular</div>

<div class="acv-text--height-medium">Medium</div>

<div class="acv-text--height-large">Large</div>

<div class="acv-text--height-x-large">Extra large</div>

## Letter spacing

<div class="acv-text--spacing-xs">Tighter</div>

<div class="acv-text--spacing-sm">Tight</div>

<div class="acv-text--spacing-md">Normal</div>

<div class="acv-text--spacing-lg">Loose</div>

## Ellipsis

<div>
    <p style="flex: 1; min-width: 0;">
    <span class="acv-text--ellipsis">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consequatur cumque deleniti dolor dolores eaque exercitationem explicabo fugit illum ipsam laborum non officiis perferendis praesentium quae ratione similique, tenetur vitae!
    </span>
    </p>
</div>

## Text transform

<div class="acv-text--uppercase">Uppercase</div>

<div class="acv-text--lowercase">Lowercase</div>

<div class="acv-text--capitalize">Capitalize</div>

## Text alignment

<div class="acv-text--align-left">Left</div>

<div class="acv-text--align-center">Center</div>

<div class="acv-text--align-right">Right</div>

<div class="acv-text--align-justify">Justify</div>

## Wrapping

<div class="acv-text--normal">        
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consequatur cumque deleniti dolor dolores eaque exercitationem explicabo fugit illum ipsam laborum non officiis perferendis praesentium quae ratione similique, tenetur vitae!
</div>

<div class="acv-text--nowrap">        
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consequatur cumque deleniti dolor dolores eaque exercitationem explicabo fugit illum ipsam laborum non officiis perferendis praesentium quae ratione similique, tenetur vitae!
</div>

<div class="acv-text--break">        
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consequatur cumque deleniti dolor dolores eaque exercitationem explicabo fugit illum ipsam laborum non officiis perferendis praesentium quae ratione similique, tenetur vitae!
</div>

## Text colors

<div class="acv-text--color-primary">Primary</div>

<div class="acv-text--color-secondary">Secondary</div>

<div class="acv-text--color-success">Success</div>

<div class="acv-text--color-warning">Warning</div>

<div class="acv-text--color-critical">Critical</div>

<div class="acv-text--color-danger">Danger</div>

<div class="acv-text--color-error">Error</div>

<div class="acv-text--color-info">Info</div>

<div class="acv-text--color-neutral">Neutral</div>

<div class="acv-text--color-disabled">Disabled</div>

<div class="acv-text--color-inversed">Inversed</div>

<div class="acv-text--color-white">White</div>

<div class="acv-text--color-black">Black</div>

<div class="acv-text--color-link">Link</div>

<div class="acv-text--color-highlight bg-white">Highlight</div>

## Backgrounds

<div class="acv-bg-primary acv-text--color-inversed">Primary</div>

<div class="acv-bg-inversed-primary">Inversed Primary</div>

<div class="acv-bg-secondary">Secondary</div>

<div class="acv-bg-inversed-secondary">Inversed Secondary</div>

<div class="acv-bg-tertiary">Tertiary</div>

<div class="acv-bg-white">White</div>

<div class="acv-bg-critical">Critical</div>

<div class="acv-bg-danger">Danger</div>

<div class="acv-bg-warning">Warning</div>

<div class="acv-bg-success">Success</div>

<div class="acv-bg-info">Info</div>

<div class="acv-bg-neutral">Neutral</div>

<div class="acv-bg-disabled">Disabled</div>

<div class="acv-bg-inversed">Inversed</div>

<div class="acv-bg-nav-primary acv-text--color-inversed">Nav primary</div>

<div class="acv-bg-nav-secondary">Nav Secondary</div>

<div class="acv-bg-highlight">Highlight</div>

<style scoped>
    h1, h2, h3, h4, h5, div {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 0;
        padding-inline-start: 8px;
    }

    *[class^=acv-text],
    *[class^=acv-h] {
        background-color: mistyrose;
    }
</style>
