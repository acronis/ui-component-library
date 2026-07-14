import * as React from 'react';
import { Progress, Button } from '@constructor-lab/ui-react';

export function ProgressInteractive() {
  const [progress, setProgress] = React.useState(75);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Adjust progress</span>
          <span className="text-gray-500">{progress}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setProgress(Math.max(0, progress - 10))}>
          -10%
        </Button>
        <Button onClick={() => setProgress(Math.min(100, progress + 10))}>
          +10%
        </Button>
        <Button onClick={() => setProgress(0)} variant="secondary">
          Reset
        </Button>
        <Button onClick={() => setProgress(100)} variant="secondary">
          Complete
        </Button>
      </div>
    </div>
  );
}
