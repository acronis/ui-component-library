import { useState } from 'react';
import { Chip } from '@constructor-lab/ui-react';
import { CircleCheckIcon } from '@constructor-lab/icons-react/stroke-mono';
import { TagIcon, ZapIcon } from '../icons/missing-icons';
export function ChipWithIconsRemovable() {
  const [selectedChips, setSelectedChips] = useState([
    { id: 1, label: 'Design', icon: <TagIcon className="h-4 w-4" /> },
    { id: 2, label: 'Development', icon: <ZapIcon className="h-4 w-4" /> },
    { id: 3, label: 'Testing', icon: <CircleCheckIcon className="h-4 w-4" /> },
  ]);

  const handleRemoveSelectedChip = (id: number) => {
    setSelectedChips(selectedChips.filter((chip) => chip.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedChips.map((chip) => (
          <Chip
            key={chip.id}
            icon={chip.icon}
            onRemove={() => handleRemoveSelectedChip(chip.id)}
          >
            {chip.label}
          </Chip>
        ))}
      </div>
      {selectedChips.length === 0 && (
        <p className="text-sm text-muted-foreground">All chips removed!</p>
      )}
    </div>
  );
}
