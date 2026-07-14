import * as React from 'react';
import { Progress } from '@constructor-lab/ui-react';

export function ProgressBasic() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-gray-600">{progress}% complete</p>
    </div>
  );
}
