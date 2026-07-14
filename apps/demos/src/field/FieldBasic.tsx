import * as React from 'react';
import { Field, FieldLabel, FieldDescription } from '@constructor-lab/ui-react';
import { Input } from '@constructor-lab/ui-react';

export function FieldBasic() {
  return (
    <div className="w-full max-w-sm">
      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" placeholder="johndoe" />
        <FieldDescription>This is your public display name.</FieldDescription>
      </Field>
    </div>
  );
}
