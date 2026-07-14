import { toast } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';

// ui-react's toast has no per-toast `dismissible` option — every toast
// already renders its own close button, so dismissal can't be turned off.
// This shows the closest equivalent: a normal toast (with its close button)
// plus "Dismiss All".
export function SonnerDismissible() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast('This toast can be dismissed')}>
        Show Toast
      </Button>
      <Button onClick={() => toast.dismiss()}>Dismiss All</Button>
    </div>
  );
}
