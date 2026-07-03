import { toast } from '@spec-lab/shadcn-uikit/react';
import { Button } from '@spec-lab/ui-react';

export function SonnerDismissible() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => toast('This can be dismissed', { dismissible: true })}
      >
        Dismissible
      </Button>
      <Button
        onClick={() =>
          toast('This cannot be dismissed', { dismissible: false })
        }
      >
        Not Dismissible
      </Button>
      <Button onClick={() => toast.dismiss()}>Dismiss All</Button>
    </div>
  );
}
