import { Button } from '@constructor-lab/ui-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@constructor-lab/ui-react';

export function TooltipMultiple() {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger render={<Button variant="default" />}>
            Save
          </TooltipTrigger>
          <TooltipContent>
            <p>Save your changes</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary" />}>
            Cancel
          </TooltipTrigger>
          <TooltipContent>
            <p>Discard changes</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="destructive" />}>
            Delete
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete permanently</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
