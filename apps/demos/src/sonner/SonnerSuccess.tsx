import { toast } from '@spec-lab/shadcn-uikit/react';
import { Button } from '@spec-lab/shadcn-uikit/react';

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
