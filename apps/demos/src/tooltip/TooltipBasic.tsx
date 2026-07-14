import { Button } from '@constructor-lab/ui-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@constructor-lab/ui-react';

export function TooltipBasic() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="secondary">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
