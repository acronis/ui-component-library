import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Field,
  FieldContent,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@spec-lab/ui-react';
import { InputBox, InputTextArea } from '@spec-lab/ui-react';
import { Switch } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';
import { Separator } from '@spec-lab/ui-react';

const formSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  bio: z.string().max(160, 'Bio must not exceed 160 characters.').optional(),
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .optional(),
});

export function FormLayoutSections() {
  const form = useForm<z.infer<typeof formSchema>>({
    // TO-DO.md #3: apps/demos zod 3 schemas vs zod 4 types in @hookform/resolvers — cast bypasses the false-positive
    resolver: zodResolver(formSchema as never),
    defaultValues: {
      displayName: '',
      email: '',
      bio: '',
      emailNotifications: true,
      marketingEmails: false,
      currentPassword: '',
      newPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert(JSON.stringify(values, null, 2));
  }

  return (
    <div className="w-full max-w-lg">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section: Profile */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Update your public profile information.
            </p>
          </div>
          <Controller
            control={form.control}
            name="displayName"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>Display name</FieldLabel>
                <FieldControl render={<InputBox placeholder="Your name" {...field} />} />
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
                  render={<InputBox type="email" placeholder="you@example.com" {...field} />}
                />
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
                      placeholder="A short bio about yourself"
                      className="resize-none"
                      {...field}
                    />
                  }
                />
                <FieldDescription>Up to 160 characters.</FieldDescription>
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        <Separator />

        {/* Section: Notifications */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Choose how you want to be notified.
            </p>
          </div>
          <Controller
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <Field orientation="horizontal" className="justify-between rounded-lg border p-4">
                <FieldLabel>
                  <FieldContent>
                    <span>Email notifications</span>
                    <FieldDescription>
                      Receive notifications about account activity.
                    </FieldDescription>
                  </FieldContent>
                </FieldLabel>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <Field orientation="horizontal" className="justify-between rounded-lg border p-4">
                <FieldLabel>
                  <FieldContent>
                    <span>Marketing emails</span>
                    <FieldDescription>
                      Get updates on new features and promotions.
                    </FieldDescription>
                  </FieldContent>
                </FieldLabel>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </Field>
            )}
          />
        </div>

        <Separator />

        {/* Section: Security */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">Security</h3>
            <p className="text-sm text-muted-foreground">
              Change your password. Leave blank to keep the current one.
            </p>
          </div>
          <Controller
            control={form.control}
            name="currentPassword"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>Current password</FieldLabel>
                <FieldControl
                  render={<InputBox type="password" placeholder="••••••••" {...field} />}
                />
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <Field invalid={!!fieldState.error} name={field.name}>
                <FieldLabel>New password</FieldLabel>
                <FieldControl
                  render={<InputBox type="password" placeholder="••••••••" {...field} />}
                />
                <FieldDescription>Must be at least 8 characters.</FieldDescription>
                {fieldState.error && (
                  <FieldError match>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        <Button type="submit">Save changes</Button>
      </form>
    </div>
  );
}
