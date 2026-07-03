import { Button } from '@spec-lab/ui-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@spec-lab/ui-react';

export function TooltipPositions() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary" />}>
            Top
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Tooltip on top</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex gap-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button variant="secondary" />}>
              Left
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Tooltip on left</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button variant="secondary" />}>
              Right
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Tooltip on right</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary" />}>
            Bottom
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Tooltip on bottom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
