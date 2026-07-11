import { useState } from 'react';
import {
  Button,
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Form,
  InputText,
  Meter,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from '@spec-lab/ui-react';

// A tiny 0–100 strength heuristic: length + character-class variety. Illustrative
// only — real strength estimation belongs to a library like zxcvbn.
function passwordScore(value: string): number {
  if (!value) return 0;
  let score = Math.min(value.length * 8, 60);
  if (/[A-Z]/.test(value)) score += 10;
  if (/[0-9]/.test(value)) score += 15;
  if (/[^A-Za-z0-9]/.test(value)) score += 15;
  return Math.min(score, 100);
}

export function FormValidationDemo() {
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const score = passwordScore(password);

  return (
    <Form
      className="w-full max-w-sm"
      onFormSubmit={() => {
        setSubmitted(true);
      }}
    >
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl
          render={
            <InputText type="email" placeholder="you@example.com" required />
          }
        />
        <FieldError match="valueMissing">Email is required.</FieldError>
        <FieldError match="typeMismatch">
          Enter a valid email address.
        </FieldError>
      </Field>

      <Field
        name="password"
        validate={(value) =>
          String(value).length < 8 ? 'Use at least 8 characters.' : null
        }
      >
        <FieldLabel>Password</FieldLabel>
        <FieldControl
          render={
            <InputText
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          }
        />
        <FieldError />
      </Field>

      {/* Outside the Field so it doesn't inherit the field's error color. */}
      <Meter value={score}>
        <div className="flex items-center justify-between">
          <MeterLabel>Password strength</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack />
      </Meter>

      <Button type="submit">Create account</Button>

      {submitted && (
        <p className="text-sm text-muted-foreground">
          Submitted — all fields valid ✓
        </p>
      )}
    </Form>
  );
}
