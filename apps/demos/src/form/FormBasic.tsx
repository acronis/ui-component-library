import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@spec-lab/ui-react';
import { InputBox } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export function FormBasic() {
  const form = useForm<z.infer<typeof formSchema>>({
    // Cast is required because apps/demos uses zod v3 schemas while @hookform/resolvers is typed against zod v4.
    resolver: zodResolver(formSchema as never),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Username</FieldLabel>
              <FieldControl
                render={<InputBox placeholder="Enter username" {...field} />}
              />
              <FieldDescription>
                This is your public display name.
              </FieldDescription>
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
