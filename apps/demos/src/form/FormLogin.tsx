import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '@constructor-lab/ui-react';
import { InputBox } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';
import { Checkbox } from '@constructor-lab/ui-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  remember: z.boolean(),
});

export function FormLogin() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <div className="w-full max-w-md rounded-lg border p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Email</FieldLabel>
              <FieldControl
                render={
                  <InputBox
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                }
              />
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Password</FieldLabel>
              <FieldControl
                render={
                  <InputBox
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                }
              />
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="remember"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              label="Remember me"
            />
          )}
        />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}
