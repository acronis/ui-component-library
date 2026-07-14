import { toast } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';

export function SonnerCustomDuration() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          toast('This will disappear in 1 second', { timeout: 1000 })
        }
      >
        1 Second
      </Button>
      <Button
        onClick={() =>
          toast('This will stay for 10 seconds', { timeout: 10000 })
        }
      >
        10 Seconds
      </Button>
      <Button onClick={() => toast('This will stay forever', { timeout: 0 })}>
        Infinite
      </Button>
    </div>
  );
}
