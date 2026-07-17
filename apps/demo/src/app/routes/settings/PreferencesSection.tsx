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
import type { UserPreferences } from '../../types';
import { toast } from 'sonner';

interface PreferencesSectionProps {
  preferences: UserPreferences;
  onUpdate: (preferences: Partial<UserPreferences>) => Promise<void>;
  isLoading?: boolean;
}

const fields: FormLayoutField[] = [
  {
    name: 'theme',
    label: 'Theme',
    type: 'select',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ],
  },
  {
    name: 'language',
    label: 'Language',
    type: 'select',
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
    ],
  },
  {
    name: 'density',
    label: 'Display Density',
    type: 'select',
    options: [
      { value: 'comfortable', label: 'Comfortable' },
      { value: 'compact', label: 'Compact' },
    ],
  },
  {
    name: 'emailNotifications',
    label: 'Email Notifications',
    type: 'switch',
    description: 'Receive notifications via email',
  },
  {
    name: 'pushNotifications',
    label: 'Push Notifications',
    type: 'switch',
    description: 'Receive push notifications in browser',
  },
  {
    name: 'frequency',
    label: 'Notification Frequency',
    type: 'select',
    options: [
      { value: 'realtime', label: 'Real-time' },
      { value: 'daily', label: 'Daily Digest' },
      { value: 'weekly', label: 'Weekly Summary' },
    ],
  },
];

export function PreferencesSection({
  preferences,
  onUpdate,
  isLoading = false,
}: PreferencesSectionProps) {
  const [values, setValues] = React.useState<Record<string, unknown>>(() => ({
    theme: preferences.theme,
    language: preferences.language,
    density: preferences.display.density,
    emailNotifications: preferences.notifications.email,
    pushNotifications: preferences.notifications.push,
    frequency: preferences.notifications.frequency,
  }));
  const [isSaving, setIsSaving] = React.useState(false);

  const handleValueChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const updates: Partial<UserPreferences> = {
      theme: values.theme as UserPreferences['theme'],
      language: values.language as string,
      notifications: {
        email: Boolean(values.emailNotifications),
        push: Boolean(values.pushNotifications),
        frequency:
          values.frequency as UserPreferences['notifications']['frequency'],
      },
      display: {
        density: values.density as UserPreferences['display']['density'],
        sidebarCollapsed: preferences.display.sidebarCollapsed,
      },
    };

    setIsSaving(true);
    try {
      await onUpdate(updates);
      toast.success('Preferences updated successfully');
    } catch {
      toast.error('Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Customize your application experience and notification settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormLayout
          fields={fields}
          values={values}
          onValueChange={handleValueChange}
          onSubmit={handleSubmit}
          disabled={isSaving || isLoading}
          submitLabel={isSaving ? 'Saving...' : 'Save Preferences'}
        />
      </CardContent>
    </Card>
  );
}
