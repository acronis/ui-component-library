import * as React from 'react';
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
} from '@constructor-lab/ui-react';
import { Input } from '@constructor-lab/ui-react';
import { Switch } from '@constructor-lab/ui-react';
import { Checkbox } from '@constructor-lab/ui-react';

export function FieldHorizontal() {
  return (
    <div className="w-full max-w-lg space-y-4">
      {/* Label left, control right */}
      <Field orientation="horizontal">
        <FieldLabel htmlFor="h-name">Display name</FieldLabel>
        <Input id="h-name" placeholder="Your name" className="max-w-xs" />
      </Field>

      {/* With description block */}
      <Field orientation="horizontal">
        <FieldLabel htmlFor="h-switch">
          <FieldContent>
            <span>Email notifications</span>
            <FieldDescription>
              Get notified about account activity.
            </FieldDescription>
          </FieldContent>
        </FieldLabel>
        <Switch id="h-switch" defaultChecked />
      </Field>

      {/* Checkbox horizontal */}
      <Field orientation="horizontal">
        <FieldLabel htmlFor="h-checkbox">
          <FieldContent>
            <span>Marketing emails</span>
            <FieldDescription>
              Receive updates on new features.
            </FieldDescription>
          </FieldContent>
        </FieldLabel>
        <Checkbox id="h-checkbox" />
      </Field>
    </div>
  );
}
