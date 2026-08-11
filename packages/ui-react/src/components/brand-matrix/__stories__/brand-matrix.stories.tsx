import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BoltIcon,
  BriefcaseIcon,
  MonitorIcon,
  ShieldCheckIcon,
} from '@constructor-lab/icons-react/stroke-mono';

import { BRANDS, type Brand } from '@/lib/brands';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tag } from '../../ui/tag';
import {
  SidebarPrimary,
  SidebarPrimaryContent,
  SidebarPrimaryMenu,
  SidebarPrimaryMenuItem,
} from '../../ui/sidebar-primary';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';

/**
 * A schematic app frame — sidebar, header, content — rendered once per brand.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 * Brand colours had **no rendered coverage at all**. Every other story runs
 * under the default `acronis` brand, so the visual-regression corpus could not
 * see the other 20, and `story-audit` measured only one. That blind spot hid a
 * real defect: `SidebarPrimary`'s selected menu item paints a fixed white label
 * (`--ui-text-on-brand-primary`) on each brand's own colour, which is fine on a
 * dark brand and unreadable on a light one — measured at **1.30:1** under
 * `light-gray` and **1.72:1** under `yellow-1c`, against a 4.5:1 minimum.
 *
 * `pnpm --filter @constructor-lab/ui-spec brand-contrast` finds that class of
 * bug statically across all 21 brands, but it *infers* which foreground pairs
 * with which background from token naming. These stories are what turn the
 * inference into a measurement: `story-audit` can now read the real composited
 * colours per brand, and VR gets a baseline that moves when a brand does.
 *
 * ── WHY ONE STORY PER BRAND ─────────────────────────────────────────────────
 * A single story rendering all 21 would cost two baselines instead of 42, and
 * `[data-brand]` does scope to a subtree so it would work. It is still the wrong
 * trade: a diff on the combined image says "something in the matrix moved" and
 * leaves the reviewer to find which brand. Per-brand stories make the failing
 * baseline name the brand. This repo has already been bitten by an aggregated
 * baseline inverting a review — see `.storybook/test-runner.ts`.
 *
 * ── WHAT IS DELIBERATELY IN THE FRAME ───────────────────────────────────────
 * Only surfaces where brand colour actually lands: the sidebar (brand fill,
 * on-brand text, selected vs unselected), a primary button (brand fill, on-brand
 * label), a Tag, a small records table, and body + secondary text on a plain
 * surface as the control. It is not a component showcase — anything whose colour
 * does not vary by brand adds pixels to review without adding coverage.
 *
 * ── WHY A TABLE EARNS ITS PIXELS HERE, AND WHAT IT DOES NOT BUY ─────────────
 * The whole `--ui-table-*` tier is references, and four of the semantics it
 * lands on are overridden inside the `[data-brand]` blocks:
 *
 *   • `--ui-table-global-row-border-color`  -> `--ui-border-on-surface-border`
 *   • `--ui-table-data-row-color-active`    -> `--ui-background-surface-hover`
 *   • `--ui-table-data-cell-color-active`   -> `--ui-background-surface-active`
 *   • `--ui-table-header-sort-icon-color-active`
 *                                           -> `--ui-glyph-on-surface-primary`
 *
 * **Measure it before believing it.** Resolving those four through every brand,
 * in both themes, gives TWO distinct value sets, not 21: `acronis` (the `:root`
 * base) on one side and all 20 override blocks — which are identical to each
 * other — on the other. In light mode the split is e.g. row border
 * `#d6e4f5` vs `#d7d9db` and active sort glyph `#1763cf` (blue) vs `#494c50`
 * (neutral). The rest of the tier is brand-invariant at 21/21: value text,
 * header label, and the inactive sort glyph never move.
 *
 * So the honest accounting: the table renders in exactly two ways per theme, and
 * 40 of the 42 baselines carry a table pixel-identical to a sibling's. It is
 * still worth it, for two reasons that are about *change*, not about today:
 *
 *   1. Those four tokens had **no** rendered coverage at all, and the split they
 *      encode — branded-blue chrome vs neutral chrome — is exactly the axis a
 *      brand is most likely to get wrong. A fill and a border that both move
 *      together, with nothing checking that they still separate, is the shape of
 *      the sidebar defect described above.
 *   2. A brand added later, or one of those four references re-pointed, shows up
 *      in the baseline that **names the brand**. That is the same argument as
 *      "why one story per brand" below; the redundancy across the 20 is the
 *      price of that naming, not an oversight.
 *
 * If review cost ever outweighs that, the cheap shape is to keep the table in
 * `Acronis` plus one representative override brand and drop it from the other
 * 19 — the coverage above is fully preserved by those two.
 *
 * ── WHY THESE PARTICULAR STATES ─────────────────────────────────────────────
 * Three of those four tokens are **state** colours, and a screenshot cannot
 * hover. They are therefore driven statically, through the props that exist for
 * exactly that reason:
 *
 *   • one row is `selected`, so `--ui-table-data-row-color-active` paints as a
 *     band rather than needing a pointer;
 *   • the first column is `sortable sortDirection="asc"`, so the **active** sort
 *     glyph renders, and the second is `sortable` unsorted, so the inactive one
 *     renders beside it — the two are different tokens and only one is branded,
 *     which is not visible unless both are on screen at once;
 *   • plain rows carry the border token on every row boundary.
 *
 * `--ui-table-data-row-color-hover` and the header's `cell-color-hover` stay
 * uncovered here, deliberately: there is no static prop for them, and faking one
 * with a class would test the class, not the token. Worth knowing while reading
 * the capture: `data-row-color-active` and `data-row-color-hover` resolve to the
 * *same* semantic (`--ui-background-surface-hover`), so the selected band and a
 * hovered row are the same colour by construction — the band below is not
 * evidence that selection has its own value.
 *
 * ── WHICH AXES THIS ACTUALLY ADDS ───────────────────────────────────────────
 * Both baseline families (`<id>` and `<id>--dark`) already render every brand,
 * so what the table gains here is the **brand × light/dark grid** — 42 captures
 * of the four tokens above, in the two theme resolutions where `[data-theme]` is
 * present.
 *
 * It does **not** add OS-disagreement coverage. `Foundations/Brand Matrix` is not
 * in `SUBSET_GROUPS` (`scripts/system-theme-subset.mjs`), so the `system-dark` /
 * `forced-light` profiles never run these stories. `UI/Table` *is* in that
 * subset, so the "did this style key off `[data-theme]` instead of a token"
 * assertion is already owned there — which is why it does not need duplicating
 * here. See `.storybook/visual-regression.ts` for what those profiles assert.
 */
const meta = {
  title: 'Foundations/Brand Matrix',
  parameters: {
    layout: 'fullscreen',
    // The frame is wider and taller than the clipped default capture.
    snapshot: { fullPage: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Fixed rows — no generated data. A story that renders differently per run
 * cannot own a baseline, and the point of these rows is the row *chrome*
 * (borders, the selected band, the sort glyphs), not the values in them.
 */
const WORKLOADS = [
  { name: 'app-srv-01', status: 'Protected', backup: '11 Aug, 04:12' },
  { name: 'db-primary', status: 'Protected', backup: '11 Aug, 04:08' },
  { name: 'file-share', status: 'Pending', backup: '10 Aug, 23:57' },
] as const;

/** Which row renders `selected`, held constant so the band lands identically. */
const SELECTED_WORKLOAD = 'db-primary';

function WorkloadsTable() {
  return (
    <Table size="small">
      <TableHeader>
        <TableRow>
          {/* Active vs inactive sort glyph are different tokens and only the
              active one is branded — both must be on screen to see that. */}
          <TableHead sortable sortDirection="asc">
            Workload
          </TableHead>
          <TableHead sortable>Status</TableHead>
          <TableHead>Last backup</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {WORKLOADS.map((workload) => (
          <TableRow
            key={workload.name}
            selected={workload.name === SELECTED_WORKLOAD}
          >
            <TableCell className="font-medium">{workload.name}</TableCell>
            <TableCell>{workload.status}</TableCell>
            <TableCell>{workload.backup}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Frame({ brand }: { brand: Brand }) {
  return (
    // Taller than the pre-table frame by the height of the table block. The
    // capture is `fullPage`, but the frame itself is a fixed box, so content
    // that outgrows it would clip rather than extend the screenshot.
    <div className="flex h-[560px] w-full">
      <SidebarPrimary defaultExpanded>
        <SidebarPrimaryContent>
          <SidebarPrimaryMenu>
            {/* Selected + unselected are separate token sets; both carry the
                on-brand foreground that the light brands fail. */}
            <SidebarPrimaryMenuItem href="#" icon={<MonitorIcon />} selected>
              Assets
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<ShieldCheckIcon />}>
              Protection
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<BriefcaseIcon />}>
              Clients
            </SidebarPrimaryMenuItem>
            <SidebarPrimaryMenuItem href="#" icon={<BoltIcon />}>
              Automation
            </SidebarPrimaryMenuItem>
          </SidebarPrimaryMenu>
        </SidebarPrimaryContent>
      </SidebarPrimary>

      <div className="bg-background flex min-w-0 flex-1 flex-col">
        <header className="border-border flex items-center justify-between border-b px-6 py-4">
          <span className="text-foreground text-base font-semibold">
            {brand}
          </span>
          <Tag>Brand</Tag>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h2 className="text-foreground text-lg font-semibold">
              Protection overview
            </h2>
            {/* The control: secondary text on a plain surface does not vary by
                brand, so a diff here means the semantic tier moved, not a brand. */}
            <p className="text-muted-foreground text-sm">
              Secondary text on the default surface.
            </p>
          </div>

          <div className="flex min-w-0 items-start gap-4">
            <Card className="w-64 shrink-0">
              <CardHeader>
                <CardTitle>Workloads</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                1,238 protected
              </CardContent>
            </Card>

            {/* Card and table share a row so the table costs width, not the
                height every one of the 42 baselines pays for. */}
            <div className="min-w-0 flex-1">
              <WorkloadsTable />
            </div>
          </div>

          <div className="flex gap-2">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * One export per brand, generated from `BRANDS` so a brand added to the token
 * bundle cannot be missed here — `.storybook/globals.test.ts` already fails if
 * that list drifts from the shipped `[data-brand]` blocks.
 *
 * Storybook's story-level `globals` sets the brand through the same preview
 * decorator the toolbar uses, so these render exactly as a user switching brand
 * would see, rather than through a story-only code path.
 */
const stories = Object.fromEntries(
  BRANDS.map((brand) => [
    brand
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(''),
    {
      globals: { brand },
      render: () => <Frame brand={brand} />,
    } satisfies Story,
  ])
) as Record<string, Story>;

export const Acronis = stories.Acronis;
export const BlueYellowUssSignal = stories.BlueYellowUssSignal;
export const Brown = stories.Brown;
export const DarkGray = stories.DarkGray;
export const DeepPurple = stories.DeepPurple;
export const DeepSkyItkontoret = stories.DeepSkyItkontoret;
export const GreenAlsoChoiseDf = stories.GreenAlsoChoiseDf;
export const IngramMicro = stories.IngramMicro;
export const LightBlueHp = stories.LightBlueHp;
export const LightGray = stories.LightGray;
export const OrangeTsukaeruHelpox = stories.OrangeTsukaeruHelpox;
export const Pinky = stories.Pinky;
export const Purple = stories.Purple;
export const PurpleFusionMedia = stories.PurpleFusionMedia;
export const RedFireBrick = stories.RedFireBrick;
export const RedHomePl = stories.RedHomePl;
export const Sand = stories.Sand;
export const Telstra = stories.Telstra;
export const VirtualOne = stories.VirtualOne;
export const Virtuozzo = stories.Virtuozzo;
export const Yellow1c = stories.Yellow1c;
