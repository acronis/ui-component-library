import type { Meta, StoryObj } from '@storybook/react-vite';
import { EyeIcon, TimesIcon } from '@constructor-lab/icons-react/stroke-mono';

import { ButtonIconInput } from '../button-icon-input';

const meta = {
  title: 'UI/ButtonIconInput',
  component: ButtonIconInput,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['normal', 'error'],
      description:
        'Visual style — mirrors the Figma ButtonIconInput `variant` property. `error` turns the glyph red and switches the focus ring to `--ui-focus-error`.',
      table: {
        type: { summary: "'normal' | 'error'" },
        defaultValue: { summary: 'normal' },
        category: 'Appearance',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name for the icon-only button. Provide this (or `aria-labelledby`) so the control has a label.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    children: {
      control: false,
      description: 'The icon element rendered inside the button.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    onClick: {
      control: false,
      description: 'Click handler.',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
        category: 'Events',
      },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<button>` with another element.',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    'aria-label': 'Clear',
    children: <TimesIcon />,
  },
} satisfies Meta<typeof ButtonIconInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: { variant: 'error' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ButtonIconInput aria-label="Clear">
        <TimesIcon />
      </ButtonIconInput>
      <ButtonIconInput aria-label="Clear" variant="error">
        <TimesIcon />
      </ButtonIconInput>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <ButtonIconInput aria-label="Clear">
          <TimesIcon />
        </ButtonIconInput>
        <ButtonIconInput aria-label="Clear" disabled>
          <TimesIcon />
        </ButtonIconInput>
      </div>
      <div className="flex items-center gap-3">
        <ButtonIconInput aria-label="Clear" variant="error">
          <TimesIcon />
        </ButtonIconInput>
        <ButtonIconInput aria-label="Clear" variant="error" disabled>
          <TimesIcon />
        </ButtonIconInput>
      </div>
    </div>
  ),
};

// The affordance is designed for the inside of an input box — 20×20 so it clears
// the 32px box with the field's 4px padding-y on either side.
export const InsideAnInputBox: Story = {
  render: () => (
    <div className="relative w-64">
      <input
        readOnly
        value="value@example.com"
        aria-label="Email"
        className="h-[var(--ui-input-text-global-box-height)] w-full rounded-[var(--ui-input-text-global-box-border-radius)] border border-[var(--ui-input-text-normal-box-border-color-idle)] bg-[var(--ui-input-text-global-box-color-idle)] ps-[var(--ui-input-text-global-box-padding-x)] pe-11 text-sm leading-6 text-[var(--ui-input-text-global-value-color-idle)]"
      />
      <ButtonIconInput
        aria-label="Show"
        className="absolute end-[var(--ui-input-text-global-box-padding-x)] top-1/2 -translate-y-1/2"
      >
        <EyeIcon />
      </ButtonIconInput>
    </div>
  ),
};
