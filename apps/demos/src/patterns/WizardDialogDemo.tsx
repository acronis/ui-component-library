import { type ReactNode, useState } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldControl,
  FieldLabel,
  Form,
  InputText,
  Progress,
} from '@spec-lab/ui-react';

const steps: { title: string; content: ReactNode }[] = [
  {
    title: 'Account',
    content: (
      <Field name="workspace">
        <FieldLabel>Workspace name</FieldLabel>
        <FieldControl render={<InputText placeholder="Acme Corp" required />} />
      </Field>
    ),
  },
  {
    title: 'Protection plan',
    content: (
      <Field name="plan">
        <FieldLabel>Plan name</FieldLabel>
        <FieldControl render={<InputText placeholder="Daily backup" required />} />
      </Field>
    ),
  },
  {
    title: 'Review',
    content: (
      <p className="text-sm text-muted-foreground">
        Everything looks good. Finish to create your workspace and its first
        protection plan.
      </p>
    ),
  },
];

export interface WizardDialogDemoProps {
  // Where the dialog overlay portals to. In shadow-root hosts (docs preview)
  // pass the shadow mount so the dialog inherits its styles; omit it in a
  // regular document (Vite portal) to portal to document.body.
  portalContainer?: HTMLElement | null;
}

export function WizardDialogDemo({ portalContainer }: WizardDialogDemoProps = {}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const isLast = step === steps.length - 1;

  const openWizard = () => {
    setStep(0);
    setOpen(true);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={openWizard}>Set up workspace</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent portalContainer={portalContainer}>
          <DialogHeader>
            <DialogTitle>{steps[step].title}</DialogTitle>
            <Progress value={((step + 1) / steps.length) * 100} />
          </DialogHeader>
          <Form
            onFormSubmit={() => {
              if (isLast) {
                setOpen(false);
              } else {
                setStep((s) => s + 1);
              }
            }}
          >
            <DialogBody>{steps[step].content}</DialogBody>
            <DialogFooter>
              <Button
                variant="ghost"
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
              <Button type="submit">{isLast ? 'Finish' : 'Next'}</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
