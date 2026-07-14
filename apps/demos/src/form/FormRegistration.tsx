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

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: 'First name must be at least 2 characters.',
    }),
    lastName: z.string().min(2, {
      message: 'Last name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function FormRegistration() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <div className="w-full max-w-md rounded-lg border p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>First Name</FieldLabel>
                <FieldControl
                  render={<InputBox placeholder="John" {...field} />}
                />
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>Last Name</FieldLabel>
                <FieldControl
                  render={<InputBox placeholder="Doe" {...field} />}
                />
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>
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
                    placeholder="john@example.com"
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
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Confirm Password</FieldLabel>
              <FieldControl
                render={
                  <InputBox
                    type="password"
                    placeholder="Confirm password"
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
          name="terms"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                label="I accept the terms and conditions"
              />
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
    </div>
  );
}
