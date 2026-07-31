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
 * label), a Tag, and body + secondary text on a plain surface as the control.
 * It is not a component showcase — anything whose colour does not vary by brand
 * adds pixels to review without adding coverage.
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

function Frame({ brand }: { brand: Brand }) {
  return (
    <div className="flex h-[420px] w-full">
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

          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Workloads</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              1,238 protected
            </CardContent>
          </Card>

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
