import { toast } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';

export function SonnerWithAction() {
  return (
    <Button
      onClick={() =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            onClick: () => toast.success('Undo successful'),
          },
        })
      }
    >
      Toast with Action
    </Button>
  );
}
