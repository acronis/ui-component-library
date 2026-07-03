import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@spec-lab/ui-react';

type Status = { value: string; label: string };

const statuses: Status[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'archived', label: 'Archived' },
];

export function ComboboxSmall() {
  return (
    <div className="w-[200px]">
      <Combobox items={statuses}>
        <ComboboxInput
          placeholder="Select status..."
          containerClassName="h-8"
        />
        <ComboboxContent>
          <ComboboxEmpty>No status found.</ComboboxEmpty>
          <ComboboxList>
            {(status: Status) => (
              <ComboboxItem key={status.value} value={status}>
                {status.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
