'use client';

import { useState } from 'react';
import { Button, ConfirmDialog } from '@constructor-lab/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

export function ConfirmDialogDemo() {
  const mount = useShadowMount();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete project?"
        description="This permanently removes the project and its data. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        portalContainer={mount}
        onConfirm={() => {}}
      />
    </>
  );
}
