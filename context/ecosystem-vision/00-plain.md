# 00 — The Dead-Simple Version

- **Status:** Draft for discussion
- **Part of:** [Cyber Ecosystem — Vision & Governance](README.md)
- **For:** anyone. No jargon. Read this first; the other docs add the detail.

## The problem, in one breath

Every time we build a product screen, someone rebuilds it by hand. So no two
screens come out quite the same — buttons are slightly different heights,
spacing wanders, the same "list of things" page looks different in every part of
the product. Fixing this by asking everyone to "be careful" doesn't work,
because carefulness doesn't scale across dozens of people and years.

## The idea, in one breath

**Build screens like LEGO, not like sculpting clay.**

Instead of shaping every screen from raw material each time, you snap together
**pre-approved blocks**. Because everyone uses the same blocks, every screen
comes out consistent automatically — you couldn't make it drift even if you
tried.

## The blocks (biggest to smallest)

Think of it as nested boxes. Each box is made only of the boxes one size smaller:

```
The Console          — the whole product (Cyber Console)
  └ an App / MFE      — one area of the product (e.g. "Devices", "Alerts")
      └ a Screen       — one page you land on (a route)
          └ a Template  — a reusable page shape ("a list with a detail panel")
              └ a Pattern — a reusable region ("a search-and-filter toolbar")
                  └ a Composite — a reusable chunk ("a data table")
                      └ a Primitive — a single control ("a button")
```

Plus two things every block can use: **Tokens** (the colors, spacings, fonts)
and **Icons** (the little pictures). Those come from **Figma**, where design
happens.

## The one rule

> **A block may only be built from the block one size smaller.**

A Screen is built from Templates and Patterns — never from raw buttons. A
Pattern is built from Composites. Only the smallest block (a Primitive) touches
the underlying UI library. That's it. That single rule is what makes everything
consistent — and it's checked by a machine, so it can't be forgotten.

## The "template" bit you liked

The most reused shape in real products is **"a list of things, with search, bulk
actions, and a detail panel that slides in."** Today each team rebuilds that.
We turn it into **one reusable Template**: a page team just says "use the list
template, here are my columns and actions," and the whole page appears —
identical to every other list page in the product. (This is the `common-template`
idea from pstorage, made official and machine-checked.)

## Who does what

- **PM:** describes _what the screen does_ — the states it can be in, the data,
  and what "done" means. In words, not code.
- **Designer:** explores the look in Figma and spots new reusable blocks worth
  adding. Figma is a place to _discover_ ideas, not the final rulebook.
- **Developer / AI:** turns the PM's description into a screen by snapping
  together the approved blocks, and a machine checks all the rules pass.

Nobody hand-builds screens from scratch anymore.

## Why it's worth doing

- **Consistency for free** — every screen matches, by construction.
- **Faster** — assembling approved blocks beats rebuilding from raw parts.
- **AI-friendly** — because the rules are machine-readable, an AI can build a
  correct screen and prove it's correct.
- **Cheaper to change** — fix a block once, every screen using it updates.

## Is this a new plan or the old plans?

Mostly the old plans, finally connected. We already had the blocks (tokens,
components, patterns) and the rule-checkers. This vision (a) draws the _whole_
ladder end-to-end, (b) adds the reusable **Template** shape, and (c) points out
the one hard part left: **making these rules apply in Cyber Console too**, which
today lives in a different repo and uses slightly different plumbing.

## Where to go next

- Want the picture with real file names → [`02-layer-model.md`](02-layer-model.md)
- Want to argue about a decision → [`rfcs/`](rfcs/) (the discussion board)
- Not a git person → the Confluence pages linked in [`README.md`](README.md)
