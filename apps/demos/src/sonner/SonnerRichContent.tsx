import { toast } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';

export function SonnerRichContent() {
  return (
    <Button
      onClick={() =>
        toast(
          <div className="flex flex-col gap-2">
            <div className="font-semibold">New message received</div>
            <div className="text-sm">
              <strong>John Doe:</strong> Hey, are you available for a quick
              call?
            </div>
          </div>
        )
      }
    >
      Rich Content Toast
    </Button>
  );
}
