import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@constructor-lab/ui-react';
import { InputBox } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';

const usernameSchema = z
  .string()
  .min(2, 'Username must be at least 2 characters.');

export function FormTanstackBasic() {
  const form = useForm({
    defaultValues: { username: '' },
    onSubmit: async ({ value }) => {
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => {
              const result = usernameSchema.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => {
            const errorMessage = field.state.meta.isTouched
              ? field.state.meta.errors[0]?.toString()
              : undefined;
            return (
              <Field invalid={!!errorMessage}>
                <FieldLabel>Username</FieldLabel>
                <FieldControl
                  render={
                    <InputBox
                      placeholder="Enter username"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  }
                />
                <FieldDescription>
                  This is your public display name.
                </FieldDescription>
                {errorMessage && <FieldError match>{errorMessage}</FieldError>}
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
