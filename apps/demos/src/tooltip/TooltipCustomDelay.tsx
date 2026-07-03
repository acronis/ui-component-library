import { Button } from '@spec-lab/ui-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@spec-lab/ui-react';

export function TooltipCustomDelay() {
  return (
    <TooltipProvider delay={800}>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="secondary">Slow to appear</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip has a longer delay</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
