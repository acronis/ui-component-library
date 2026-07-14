import * as React from 'react';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@constructor-lab/ui-react';
import { Input } from '@constructor-lab/ui-react';

export function FieldWithError() {
  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Single error */}
      <Field invalid>
        <FieldLabel htmlFor="email-error">Email</FieldLabel>
        <Input
          id="email-error"
          type="email"
          defaultValue="notanemail"
          aria-invalid
        />
        <FieldError match>Please enter a valid email address.</FieldError>
      </Field>

      {/* Multiple errors */}
      <Field invalid>
        <FieldLabel htmlFor="password-error">Password</FieldLabel>
        <Input
          id="password-error"
          type="password"
          defaultValue="abc"
          aria-invalid
        />
        <FieldDescription>Must be strong and unique.</FieldDescription>
        <FieldError match>
          <ul className="ml-4 flex list-disc flex-col gap-1">
            <li>Must be at least 8 characters.</li>
            <li>Must contain at least one number.</li>
          </ul>
        </FieldError>
      </Field>
    </div>
  );
}
