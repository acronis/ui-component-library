import { Button } from '@spec-lab/ui-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@spec-lab/ui-react';

export function PopoverPlacements() {
  return (
    <div className="flex flex-wrap justify-center gap-4 rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>
          Top
        </PopoverTrigger>
        <PopoverContent side="top" className="w-64">
          <p className="text-sm">This popover appears on top.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>
          Bottom
        </PopoverTrigger>
        <PopoverContent side="bottom" className="w-64">
          <p className="text-sm">This popover appears on bottom.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>
          Left
        </PopoverTrigger>
        <PopoverContent side="left" className="w-64">
          <p className="text-sm">This popover appears on left.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>
          Right
        </PopoverTrigger>
        <PopoverContent side="right" className="w-64">
          <p className="text-sm">This popover appears on right.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
