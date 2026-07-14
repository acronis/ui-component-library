import { toast } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';

// ui-react's toast has no separate `cancel` slot — every toast already shows
// a built-in close button, and only a single inline `action` is supported.
// The closest equivalent is a confirm-style toast with one action button;
// the always-present close button covers "cancel".
export function SonnerWithCancel() {
  return (
    <Button
      onClick={() =>
        toast('Are you sure?', {
          description: 'This action cannot be undone.',
          action: {
            label: 'Continue',
            onClick: () => toast.success('Action completed'),
          },
        })
      }
    >
      Toast with Cancel
    </Button>
  );
}
