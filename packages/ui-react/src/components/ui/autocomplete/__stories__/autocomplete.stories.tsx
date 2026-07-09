import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '../autocomplete';

const meta = {
  title: 'UI/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

const countries = [
  'Australia',
  'Austria',
  'Belgium',
  'Canada',
  'Denmark',
  'France',
  'Germany',
  'Ireland',
];

export const Default: Story = {
  render: () => (
    <div className="w-[260px]">
      <Autocomplete items={countries}>
        <AutocompleteInput placeholder="Search country…" clearable />
        <AutocompleteContent>
          <AutocompleteEmpty>No match — use what you typed.</AutocompleteEmpty>
          <AutocompleteList>
            {(item: string) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  ),
};

export const Open: Story = {
  render: () => (
    <div className="w-[260px]">
      <Autocomplete items={countries} defaultOpen defaultValue="Au">
        <AutocompleteInput placeholder="Search country…" />
        <AutocompleteContent>
          <AutocompleteEmpty>No match — use what you typed.</AutocompleteEmpty>
          <AutocompleteList>
            {(item: string) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    input?.focus();
  },
};
