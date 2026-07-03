import { toast } from '@spec-lab/shadcn-uikit/react';
import { Button } from '@spec-lab/ui-react';

export function SonnerWithCancel() {
  return (
    <Button
      onClick={() =>
        toast('Are you sure?', {
          description: 'This action cannot be undone.',
          cancel: {
            label: 'Cancel',
            onClick: () => console.log('Cancelled'),
          },
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
