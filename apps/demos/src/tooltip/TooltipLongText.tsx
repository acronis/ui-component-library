import { Button } from '@constructor-lab/ui-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@constructor-lab/ui-react';

export function TooltipLongText() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary" />}>
          Hover for details
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>
            This is a longer tooltip text that provides more detailed
            information about the element.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
