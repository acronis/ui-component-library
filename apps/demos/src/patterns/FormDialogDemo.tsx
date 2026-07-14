import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  Form,
  InputText,
} from '@constructor-lab/ui-react';

export interface FormDialogDemoProps {
  // Where the dialog overlay portals to. In shadow-root hosts (docs preview)
  // pass the shadow mount so the dialog inherits its styles; omit it in a
  // regular document (Vite portal) to portal to document.body.
  portalContainer?: HTMLElement | null;
}

export function FormDialogDemo({ portalContainer }: FormDialogDemoProps = {}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => setOpen(true)}>New project</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent portalContainer={portalContainer}>
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <Form onFormSubmit={() => setOpen(false)}>
            <DialogBody className="flex flex-col gap-4">
              <Field name="name">
                <FieldLabel>Name</FieldLabel>
                <FieldControl
                  render={<InputText placeholder="Acme migration" required />}
                />
                <FieldError />
              </Field>
              <Field name="key">
                <FieldLabel>Key</FieldLabel>
                <FieldControl render={<InputText placeholder="ACME" />} />
                <FieldDescription>
                  A short identifier used in URLs.
                </FieldDescription>
              </Field>
            </DialogBody>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost">Cancel</Button>} />
              <Button type="submit">Create</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
