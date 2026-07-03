import { toast } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';

export function SonnerBasic() {
  return (
    <Button onClick={() => toast('Event has been created')}>Show Toast</Button>
  );
}
