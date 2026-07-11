import { toast } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';

// ui-react's `Toaster` renders a single stack fixed to the bottom-right of
// the viewport — there's no per-toast `position` option. This drops to the
// closest capability: a note about the fixed placement, plus a basic toast.
export function SonnerPositions() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Toasts always appear in a single stack, fixed to the bottom-right of the
        viewport.
      </p>
      <Button onClick={() => toast('This toast is always bottom-right')}>
        Show Toast
      </Button>
    </div>
  );
}
