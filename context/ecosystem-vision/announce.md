# Chat hook-on messages

Copy-paste messages to kick off the discussion in Slack/Teams. Pick the audience,
drop the message, link the two Confluence pages:

- **Vision:** <https://adn.acronis.work/pages/viewpage.action?pageId=301062259>
- **Discussion board (RFCs):** <https://adn.acronis.work/pages/viewpage.action?pageId=301062260>

Keep the _decisions_ in the RFCs; use chat only to pull people in.

---

## 1. General kickoff (any channel)

> 🧩 **We wrote down a north-star for how we build Cyber, end to end.**
> The idea in one line: **build screens like LEGO, not like sculpting clay** —
> snap together pre-approved blocks (`App → Screen → Template → Pattern →
Composite → Primitive`, on shared tokens + icons from Figma) so every screen
> comes out consistent automatically instead of relying on everyone being careful.
>
> It's a **draft on purpose** — nothing's decided. 5 open questions are up as RFCs.
> 👀 2-min read: [Vision]. 🗳️ Weigh in: [Discussion board].
> Which layer do _you_ live in? Tell me where it breaks for you.

---

## 2. For PMs

> 📋 **PMs — this changes how you spec a screen (for the better).**
> You'd describe _what a screen does_ — its states, its data, and what "done"
> means — in plain words. An AI turns that into the actual screen, and a machine
> checks it. You never wire components or argue pixels.
> The catch: your PRD needs to spell out every **state** + **acceptance criteria**
> (those become the automated "is it done?" test).
> Is that a fair ask? 👉 [Vision] · comment on **RFC-0004** in [Discussion board].

---

## 3. For designers

> 🎨 **Designers — Figma becomes a place to _discover_ patterns, not the final rulebook.**
> The proposal: the implementation can be _more consistent than the mockup_ by
> snapping your design onto approved patterns — and when you invent something
> genuinely new, you propose it as a new reusable block and we add it to the kit.
> You seed the catalog; you're not pixel-policed.
> Does "the code may intentionally differ from my mockup" sit right with you?
> 👉 [Vision §Figma is a weak source] · **RFC-0002** (the reusable page templates).

---

## 4. For developers

> 🛠️ **Devs — the pitch: stop hand-building screens; compose from a governed catalog and let 3 gates guarantee the look.**
> Downward-only rule (`Screen → Template → Pattern → Composite → Primitive`;
> only primitives touch Base UI), enforced by schema + `require-pattern` ESLint +
> the rendered `screen-audit`. Most of this already exists in `ui-spec` — we're
> naming the spine and closing 3 gaps.
> Two I want fights about: **RFC-0003** (`require-pattern` — how strict, how fast?)
> and **RFC-0005** (the `@constructor-lab/*` vs `@acronis-platform/*` scope split +
> oxlint vs ESLint in Cyber Console).
> 👉 RFC files: `context/ecosystem-vision/rfcs/` · [Discussion board].

---

## 5. One-liner (thread reply / status)

> Building Cyber screens like LEGO instead of clay: `App → Screen → Template →
Pattern → Composite → Primitive`, every layer machine-validated. Draft + 5 open
> RFCs → [Discussion board]. Tell me where it breaks.

---

## 6. Nudge (a few days later, if quiet)

> ⏰ Reminder: the **Cyber ecosystem** RFCs are still open and un-decided. If you
> don't want a rule to block your CI, now's the cheap moment to say so —
> especially **RFC-0003** (enforcement) and **RFC-0005** (cross-repo). Silence =
> consent to the recommendations. 👉 [Discussion board].
