import { Button } from '@spec-lab/ui-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@spec-lab/ui-react';

export function PopoverBasic() {
  return (
    <div className="flex justify-center rounded-lg border p-8">
      <Popover>
        <PopoverTrigger render={<Button variant="secondary" />}>
          Open Popover
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-semibold leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
