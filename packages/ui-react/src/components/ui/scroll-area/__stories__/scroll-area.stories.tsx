import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea } from '../scroll-area';

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
      description: 'Which scrollbar(s) to render.',
      table: { type: { summary: "'vertical' | 'horizontal' | 'both'" } },
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const Rows = () => (
  <div className="flex flex-col gap-2 p-4">
    {Array.from({ length: 24 }, (_, i) => (
      <div
        key={i}
        className="rounded-md bg-[var(--ui-background-surface-secondary)] px-3 py-2 text-sm"
      >
        Item {i + 1}
      </div>
    ))}
  </div>
);

// args drive the Controls panel; render spreads them so changing a control
// re-renders the ScrollArea.
export const Default: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <ScrollArea {...args} className="h-64 w-72 rounded-md border border-border">
      <Rows />
    </ScrollArea>
  ),
};

// The bar is hidden at rest and revealed on hover/scroll. This variant forces it
// visible so the thumb styling is captured in the visual baseline.
export const AlwaysVisible: Story = {
  render: () => (
    <ScrollArea className="h-64 w-72 rounded-md border border-border [&_[data-slot=scroll-area-scrollbar]]:opacity-100">
      <Rows />
    </ScrollArea>
  ),
};

// The thumb's two sizes, side by side: 6px at rest, 10px while pointed at or
// dragged, the growth landing inward so the outer edge stays flush.
//
// The grown one is FORCED with a class override rather than a real `:hover`,
// because the generated `Hover`/`Active` stories cannot paint it — they set
// `parameters.pseudo`, and no pseudo-states addon is installed, so all three
// capture the rest state and are byte-identical to each other. This is the same
// override trick the stories already use to pin the bar visible. It proves the
// resulting geometry, not that `:hover` is what triggers it; the trigger is
// asserted by class in the unit tests, and was measured in a browser.
export const ThumbSizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <ScrollArea className="h-64 w-64 rounded-md border border-border [&_[data-slot=scroll-area-scrollbar]]:opacity-100">
        <Rows />
      </ScrollArea>
      <ScrollArea className="h-64 w-64 rounded-md border border-border [&_[data-slot=scroll-area-scrollbar]]:opacity-100 [&_[data-slot=scroll-area-thumb]]:-ms-0.5 [&_[data-slot=scroll-area-thumb]]:w-2.5">
        <Rows />
      </ScrollArea>
    </div>
  ),
};

// `tone="inverse"` over a brand surface — the case the themed default cannot
// serve, because `--ui-background-brand-primary` is dark in light mode too.
// Captured next to the default so a regression in either is visible in one PNG.
export const Tones: Story = {
  render: () => (
    <div className="flex gap-4">
      <ScrollArea className="h-64 w-64 rounded-md border border-border [&_[data-slot=scroll-area-scrollbar]]:opacity-100">
        <Rows />
      </ScrollArea>
      <div className="rounded-md bg-[var(--ui-background-brand-primary)] p-2">
        <ScrollArea
          tone="inverse"
          className="h-60 w-64 [&_[data-slot=scroll-area-scrollbar]]:opacity-100"
        >
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className="rounded-md bg-[var(--ui-background-brand-secondary)] px-3 py-2 text-sm text-[var(--ui-text-on-brand-primary)]"
              >
                Item {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      orientation="horizontal"
      className="w-80 rounded-md border border-border [&_[data-slot=scroll-area-scrollbar]]:opacity-100"
    >
      <div className="flex w-max gap-3 p-4">
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className="flex size-24 shrink-0 items-center justify-center rounded-md bg-[var(--ui-background-surface-secondary)] text-sm"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Both: Story = {
  render: () => (
    <ScrollArea
      orientation="both"
      className="h-64 w-80 rounded-md border border-border [&_[data-slot=scroll-area-scrollbar]]:opacity-100"
    >
      <div className="grid w-max grid-cols-8 gap-3 p-4">
        {Array.from({ length: 64 }, (_, i) => (
          <div
            key={i}
            className="flex size-16 shrink-0 items-center justify-center rounded-md bg-[var(--ui-background-surface-secondary)] text-sm"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
