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
} from '@constructor-lab/ui-react';
import { InputBox, InputTextArea } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  bio: z
    .string()
    .max(160, {
      message: 'Bio must not be longer than 160 characters.',
    })
    .optional(),
});

export function FormProfile() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      bio: '',
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
                render={<InputBox placeholder="johndoe" {...field} />}
              />
              <FieldDescription>
                This is your public display name. It can be your real name or a
                pseudonym.
              </FieldDescription>
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
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
              <FieldDescription>
                We&apos;ll never share your email with anyone else.
              </FieldDescription>
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="bio"
          render={({ field, fieldState }) => (
            <Field invalid={!!fieldState.error} name={field.name}>
              <FieldLabel>Bio</FieldLabel>
              <FieldControl
                render={
                  <InputTextArea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                }
              />
              <FieldDescription>
                You can write up to 160 characters.
              </FieldDescription>
              {fieldState.error && (
                <FieldError match>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </div>
  );
}
