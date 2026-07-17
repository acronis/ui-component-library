import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormLayout,
} from '@constructor-lab/ui-react';
import type { FormLayoutField } from '@constructor-lab/ui-react';
import { passwordChangeSchema } from '../../lib/validators';
import type { PasswordChangeFormData } from '../../lib/validators';
import { toast } from 'sonner';

interface AccountSectionProps {
  onPasswordChange: (data: PasswordChangeFormData) => Promise<void>;
  isLoading?: boolean;
}

const emptyValues: Record<string, unknown> = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const fields: FormLayoutField[] = [
  {
    name: 'currentPassword',
    label: 'Current Password',
    type: 'password',
    placeholder: 'Enter current password',
    required: true,
  },
  {
    name: 'newPassword',
    label: 'New Password',
    type: 'password',
    placeholder: 'Enter new password',
    required: true,
    description: 'Password must be at least 6 characters long',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm New Password',
    type: 'password',
    placeholder: 'Confirm new password',
    required: true,
  },
];

export function AccountSection({
  onPasswordChange,
  isLoading = false,
}: AccountSectionProps) {
  const [values, setValues] =
    React.useState<Record<string, unknown>>(emptyValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = React.useState(false);

  const handleValueChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const result = passwordChangeSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      await onPasswordChange(result.data);
      toast.success('Password changed successfully');
      setValues(emptyValues);
    } catch {
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>
          Change your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormLayout
          fields={fields}
          values={values}
          onValueChange={handleValueChange}
          onSubmit={handleSubmit}
          errors={errors}
          disabled={isSaving || isLoading}
          submitLabel={
            isSaving || isLoading ? 'Changing Password...' : 'Change Password'
          }
        />
      </CardContent>
    </Card>
  );
}
