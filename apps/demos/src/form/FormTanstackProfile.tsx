import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@spec-lab/ui-react';
import { InputBox, InputTextArea } from '@spec-lab/ui-react';
import { Button } from '@spec-lab/ui-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@spec-lab/ui-react';

const profileSchema = z.object({
  username: z
    .string()
    .min(2, 'At least 2 characters.')
    .max(30, 'Max 30 characters.'),
  email: z.string().email('Enter a valid email address.'),
  role: z.string().min(1, 'Please select a role.'),
  bio: z.string().max(160, 'Max 160 characters.').optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

const roleItems = { admin: 'Admin', editor: 'Editor', viewer: 'Viewer' };

export function FormTanstackProfile() {
  const [submitted, setSubmitted] = React.useState<ProfileValues | null>(null);

  const form = useForm({
    defaultValues: { username: '', email: '', role: '', bio: '' },
    onSubmit: async ({ value }) => setSubmitted(value as ProfileValues),
  });

  if (submitted) {
    return (
      <div className="w-full max-w-md rounded-lg border p-6 space-y-3">
        <p className="text-sm font-medium text-green-600">Profile saved!</p>
        <pre className="text-xs bg-muted rounded p-3 overflow-auto">
          {JSON.stringify(submitted, null, 2)}
        </pre>
        <Button variant="secondary" onClick={() => setSubmitted(null)}>
          Edit again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) => {
                const result = profileSchema.shape.username.safeParse(value);
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
                        placeholder="johndoe"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    }
                  />
                  <FieldDescription>Your public display name.</FieldDescription>
                  {errorMessage && (
                    <FieldError match>{errorMessage}</FieldError>
                  )}
                </Field>
              );
            }}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = profileSchema.shape.email.safeParse(value);
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
                  <FieldLabel>Email</FieldLabel>
                  <FieldControl
                    render={
                      <InputBox
                        type="email"
                        placeholder="jane@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    }
                  />
                  {errorMessage && (
                    <FieldError match>{errorMessage}</FieldError>
                  )}
                </Field>
              );
            }}
          </form.Field>

          <form.Field
            name="role"
            validators={{
              onChange: ({ value }) => {
                const result = profileSchema.shape.role.safeParse(value);
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
                  <FieldLabel>Role</FieldLabel>
                  <Select
                    items={roleItems}
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val ?? '')}
                  >
                    <SelectTrigger onBlur={field.handleBlur}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorMessage && (
                    <FieldError match>{errorMessage}</FieldError>
                  )}
                </Field>
              );
            }}
          </form.Field>

          <form.Field
            name="bio"
            validators={{
              onChange: ({ value }) => {
                const result = profileSchema.shape.bio.safeParse(value);
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
                  <FieldLabel>Bio</FieldLabel>
                  <FieldControl
                    render={
                      <InputTextArea
                        placeholder="Tell us a little about yourself"
                        className="resize-none"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    }
                  />
                  <FieldDescription>Up to 160 characters.</FieldDescription>
                  {errorMessage && (
                    <FieldError match>{errorMessage}</FieldError>
                  )}
                </Field>
              );
            }}
          </form.Field>

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save profile'}
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </div>
  );
}
