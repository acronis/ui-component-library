import { toast } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';

export function SonnerSuccess() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast.success('Successfully saved!')}>
        Success
      </Button>
      <Button
        onClick={() =>
          toast.success('Profile updated', {
            description: 'Your profile has been updated successfully.',
          })
        }
      >
        Success with Description
      </Button>
    </div>
  );
}
