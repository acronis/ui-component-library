import * as React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormLayout,
} from '@constructor-lab/ui-react';
import type { FormLayoutField } from '@constructor-lab/ui-react';
import { profileSchema } from '../../lib/validators';
import type { ProfileFormData } from '../../lib/validators';
import type { User } from '../../types';
import { toast } from 'sonner';

interface ProfileSectionProps {
  user: User;
  onUpdate: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

const fields: FormLayoutField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter your name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email',
    required: true,
  },
  {
    name: 'avatar',
    label: 'Avatar URL',
    type: 'text',
    placeholder: 'https://example.com/avatar.jpg',
    description: 'Update your avatar by pasting an image URL',
  },
];

export function ProfileSection({
  user,
  onUpdate,
  isLoading = false,
}: ProfileSectionProps) {
  const [values, setValues] = React.useState<Record<string, unknown>>(() => ({
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? '',
  }));
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = React.useState(false);

  const handleValueChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const result = profileSchema.safeParse(values);
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
      await onUpdate(result.data);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const avatarUrl =
    typeof values.avatar === 'string' ? values.avatar : undefined;
  const displayName = typeof values.name === 'string' ? values.name : user.name;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="text-2xl">
              {displayName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">Profile Picture</p>
            <p className="text-sm text-muted-foreground">
              Update your avatar URL below
            </p>
          </div>
        </div>

        <FormLayout
          fields={fields}
          values={values}
          onValueChange={handleValueChange}
          onSubmit={handleSubmit}
          errors={errors}
          disabled={isSaving || isLoading}
          submitLabel={isSaving || isLoading ? 'Saving...' : 'Save Changes'}
        />
      </CardContent>
    </Card>
  );
}
