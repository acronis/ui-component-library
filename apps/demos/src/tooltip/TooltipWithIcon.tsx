import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@spec-lab/ui-react';
import { CircleInfoIcon } from '@spec-lab/icons-react/stroke-mono';
export function TooltipWithIcon() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <button className="inline-flex items-center justify-center rounded-full w-6 h-6 bg-gray-200 hover:bg-gray-300 transition-colors" />
          }
        >
          <CircleInfoIcon className="w-4 h-4 text-gray-600" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
