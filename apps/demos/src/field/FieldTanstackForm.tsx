import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import * as z from 'zod';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from '@constructor-lab/ui-react';
import { Input } from '@constructor-lab/ui-react';
import { Textarea } from '@constructor-lab/ui-react';
import { Button } from '@constructor-lab/ui-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@constructor-lab/ui-react';

const schema = z.object({
  username: z
    .string()
    .min(2, 'At least 2 characters.')
    .max(30, 'Max 30 characters.'),
  email: z.string().email('Enter a valid email address.'),
  role: z.string().min(1, 'Please select a role.'),
  bio: z.string().max(160, 'Max 160 characters.').optional(),
});

type FormValues = z.infer<typeof schema>;

// FieldError renders a single message; fold TanStack Form's error list into
// text or a bulleted list, matching the legacy field's multi-error display.
function fieldErrorContent(errors: unknown[]) {
  const messages = errors
    .map((error) => (error == null ? '' : String(error)))
    .filter(Boolean);
  if (messages.length === 0) return null;
  if (messages.length === 1) return messages[0];
  return (
    <ul className="ml-4 flex list-disc flex-col gap-1">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}

export function FieldTanstackForm() {
  const [submitted, setSubmitted] = React.useState<FormValues | null>(null);

  const form = useForm({
    defaultValues: { username: '', email: '', role: '', bio: '' },
    onSubmit: async ({ value }) => setSubmitted(value as FormValues),
  });

  if (submitted) {
    return (
      <div className="w-full max-w-md rounded-lg border p-6 space-y-3">
        <p className="text-sm font-medium text-green-600">Saved!</p>
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
                const result = schema.shape.username.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <Field
                invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              >
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="johndoe"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                />
                <FieldDescription>Your public display name.</FieldDescription>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError match>
                      {fieldErrorContent(field.state.meta.errors)}
                    </FieldError>
                  )}
              </Field>
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = schema.shape.email.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <Field
                invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              >
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  type="email"
                  placeholder="jane@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError match>
                      {fieldErrorContent(field.state.meta.errors)}
                    </FieldError>
                  )}
              </Field>
            )}
          </form.Field>

          <form.Field
            name="role"
            validators={{
              onChange: ({ value }) => {
                const result = schema.shape.role.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <Field
                invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
              >
                <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val ?? '')}
                >
                  <SelectTrigger id={field.name} onBlur={field.handleBlur}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError match>
                      {fieldErrorContent(field.state.meta.errors)}
                    </FieldError>
                  )}
              </Field>
            )}
          </form.Field>

          <form.Field
            name="bio"
            validators={{
              onChange: ({ value }) => {
                const result = schema.shape.bio.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  id={field.name}
                  placeholder="Tell us a little about yourself"
                  className="resize-none"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldDescription>Up to 160 characters.</FieldDescription>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <FieldError match>
                      {fieldErrorContent(field.state.meta.errors)}
                    </FieldError>
                  )}
              </Field>
            )}
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
