import { toast } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';

export function SonnerBasic() {
  return (
    <Button onClick={() => toast('Event has been created')}>Show Toast</Button>
  );
}
