import { useState } from 'react';
import {
  Button,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Form,
  InputText,
  InputTextArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@constructor-lab/ui-react';

export interface FormLayoutDemoProps {
  // In shadow-root hosts (docs preview) pass the shadow mount so the Select
  // popup inherits its styles; omit it in a regular document.
  portalContainer?: HTMLElement | null;
}

export function FormLayoutDemo({ portalContainer }: FormLayoutDemoProps = {}) {
  const [saved, setSaved] = useState(false);

  return (
    <Form
      className="w-full max-w-2xl"
      onFormSubmit={() => {
        setSaved(true);
      }}
    >
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <Field name="name">
          <FieldLabel>Full name</FieldLabel>
          <FieldControl
            render={<InputText placeholder="Ada Lovelace" required />}
          />
          <FieldError match="valueMissing">Name is required.</FieldError>
        </Field>
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <FieldControl
            render={
              <InputText type="email" placeholder="ada@example.com" required />
            }
          />
          <FieldError match="valueMissing">Email is required.</FieldError>
          <FieldError match="typeMismatch">
            Enter a valid email address.
          </FieldError>
        </Field>
        <Field name="bio">
          <FieldLabel>Bio</FieldLabel>
          <FieldControl
            render={<InputTextArea placeholder="A short introduction" />}
          />
          <FieldDescription>Shown on your public profile.</FieldDescription>
        </Field>
      </FieldSet>

      <FieldSet>
        <FieldLegend variant="label">Role</FieldLegend>
        <Select defaultValue="member" name="role">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent portalContainer={portalContainer}>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
      </FieldSet>

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {saved ? 'Saved ✓' : ''}
        </span>
        <div className="flex gap-2">
          <Button type="button" variant="ghost">
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </div>
    </Form>
  );
}
