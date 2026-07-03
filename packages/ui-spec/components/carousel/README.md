# Carousel

A slideshow of scrollable, snapping slides with Previous / Next controls —
horizontal or vertical, with optional loop and autoplay.

> **Design-pending v1.** Ported from the legacy shadcn UI kit's `carousel`, built on the headless
> [`embla-carousel-react`](https://www.embla-carousel.com/) engine (drag, snap,
> loop, plugins). The **navigation follows the legacy Figma mockup**: a bottom bar
> with a "← Prev" link, pagination dots, and a "Next →" link (`CarouselNavigation`),
> not overlay arrows. Reconcile further with `/figma-component Carousel <url> --update`.

## When to use

- A gallery of images/cards the user swipes or steps through.
- A constrained space showing a few of many items at a time (`basis-1/3`).

## When not to use

- All content should be visible at once → use a grid / flex list.
- A step-by-step flow with distinct states → use a stepper / tabs.

## Usage

Compose from the parts; each `CarouselItem` sets its own `basis`:

```tsx
<Carousel opts={{ loop: true }}>
  <CarouselContent>
    {items.map((item) => (
      <CarouselItem key={item.id} className="basis-1/3">
        {item.content}
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselNavigation /> {/* ← Prev · dots · Next → */}
</Carousel>
```

`CarouselNavigation` is the mockup bar; for full control compose the pieces
yourself (`CarouselPrevious` / `CarouselDots` / `CarouselNext`).

For programmatic control (autoplay, external dots, "slide N of M"), grab the
engine api:

```tsx
const [api, setApi] = React.useState<CarouselApi>();
<Carousel setApi={setApi}>…</Carousel>;
// api?.scrollNext(); api?.on('select', …)
```

## Parts

| Part                 | Element  | Role                | Notes                                 |
| -------------------- | -------- | ------------------- | ------------------------------------- |
| `Carousel`           | `div`    | `region` (carousel) | Root; owns the engine + keyboard nav. |
| `CarouselContent`    | `div`    | —                   | The scroll viewport + flex track.     |
| `CarouselItem`       | `div`    | `group` (slide)     | A single slide; set its `basis`.      |
| `CarouselNavigation` | `div`    | —                   | Mockup bar: Prev · dots · Next.       |
| `CarouselPrevious`   | `button` | —                   | "← Prev" ghost `Button`.              |
| `CarouselDots`       | `div`    | `tablist`           | Pagination dots (one per slide).      |
| `CarouselNext`       | `button` | —                   | "Next →" ghost `Button`.              |
