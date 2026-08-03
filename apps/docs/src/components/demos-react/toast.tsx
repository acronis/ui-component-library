'use client';

import { Button, Toaster, toast } from '@constructor-lab/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

export function ToastDemo() {
  const mount = useShadowMount();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          toast('Event created', {
            description: 'Monday, January 3rd at 6:00 PM',
          })
        }
      >
        Default
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.success('Profile saved', {
            description: 'Your changes have been saved.',
          })
        }
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.warning('Disk space low', {
            description: 'Less than 10% remaining.',
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.critical('Backup at risk', {
            description: 'The last two runs did not complete.',
          })
        }
      >
        Critical
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error('Delete failed', {
            description: 'Please try again or contact support.',
          })
        }
      >
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.info('Event created', {
            description: 'Monday, January 3rd at 6:00 PM',
            action: { label: 'Undo', onClick: () => {} },
          })
        }
      >
        With action
      </Button>
      <Toaster portalContainer={mount} />
    </div>
  );
}
