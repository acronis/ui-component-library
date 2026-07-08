import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from '@spec-lab/ui-react';

export interface ConfirmDialogDemoProps {
  // Where the alert-dialog overlay portals to. In shadow-root hosts (docs
  // preview) pass the shadow mount so the dialog inherits its styles; omit it
  // in a regular document (Vite portal) to portal to document.body.
  portalContainer?: HTMLElement | null;
}

export function ConfirmDialogDemo({ portalContainer }: ConfirmDialogDemoProps = {}) {
  const [open, setOpen] = useState(false);
  const name = 'db-prod-01';

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete workload
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent portalContainer={portalContainer}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes {name} and its data. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={<Button variant="ghost">Cancel</Button>} />
            <AlertDialogAction
              render={<Button variant="destructive">Delete</Button>}
              onClick={() => setOpen(false)}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
