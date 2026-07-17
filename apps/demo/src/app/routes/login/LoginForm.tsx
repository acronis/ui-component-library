import * as React from 'react';
import { FormLayout, type FormLayoutField } from '@constructor-lab/ui-react';
import { toast } from 'sonner';
import { loginSchema } from '../../lib/validators';
import type { LoginFormData } from '../../lib/validators';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
}

const fields: FormLayoutField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'demo@example.com',
    required: true,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
  {
    name: 'rememberMe',
    label: 'Remember me',
    type: 'checkbox',
  },
];

const initialValues: LoginFormData = {
  email: '',
  password: '',
  rememberMe: false,
};

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [values, setValues] = React.useState<LoginFormData>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleValueChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !(key in nextErrors)) {
          nextErrors[key] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    try {
      await onSubmit(result.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <FormLayout
      fields={fields}
      values={values}
      onValueChange={handleValueChange}
      onSubmit={handleSubmit}
      errors={errors}
      disabled={isLoading}
      submitLabel={isLoading ? 'Signing in...' : 'Sign in'}
    />
  );
}
