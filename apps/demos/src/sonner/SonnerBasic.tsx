import { toast } from '@spec-lab/shadcn-uikit/react';
import { Button } from '@spec-lab/shadcn-uikit/react';

export function SonnerBasic() {
  return (
    <Button onClick={() => toast('Event has been created')}>Show Toast</Button>
  );
}
