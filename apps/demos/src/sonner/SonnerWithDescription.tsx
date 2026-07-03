import { toast } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';

export function SonnerWithDescription() {
  return (
    <Button
      onClick={() =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
        })
      }
    >
      Show Toast with Description
    </Button>
  );
}
