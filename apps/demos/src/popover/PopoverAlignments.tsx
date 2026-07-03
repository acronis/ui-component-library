import { Button } from '@spec-lab/ui-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@spec-lab/ui-react';

export function PopoverAlignments() {
  return (
    <div className="flex flex-wrap justify-center gap-4 rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>
          Align Start
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64">
          <p className="text-sm">Aligned to the start.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>
          Align Center
        </PopoverTrigger>
        <PopoverContent align="center" className="w-64">
          <p className="text-sm">Aligned to the center.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>
          Align End
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <p className="text-sm">Aligned to the end.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
