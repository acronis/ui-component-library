import * as React from 'react';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderRow,
  PageHeaderTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@constructor-lab/ui-react';
import { ProfileSection } from './ProfileSection';
import { PreferencesSection } from './PreferencesSection';
import { AccountSection } from './AccountSection';
import { useAuth } from '../../hooks/useAuth';
import { useLocale } from '../../context/LocaleContext';
import { getStorage, updatePreferences } from '../../lib/storage';
import type {
  ProfileFormData,
  PasswordChangeFormData,
} from '../../lib/validators';
import type { UserPreferences } from '../../types';

export function SettingsPage() {
  const { t } = useLocale();
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = React.useState<UserPreferences>(() => {
    const storage = getStorage();
    return storage.preferences;
  });

  const handleProfileUpdate = async (data: ProfileFormData) => {
    if (!user) return;
    updateUser({
      name: data.name,
      email: data.email,
      avatar: data.avatar || undefined,
    });
  };

  const handlePreferencesUpdate = async (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    updatePreferences(updates);

    if (updates.theme) {
      document.documentElement.classList.toggle(
        'dark',
        updates.theme === 'dark'
      );
    }
  };

  const handlePasswordChange = async (_data: PasswordChangeFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t('messages.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderTitle>{t('navigation.settings')}</PageHeaderTitle>
        </PageHeaderRow>
        <PageHeaderDescription>
          Manage your profile, preferences, and account security.
        </PageHeaderDescription>
      </PageHeader>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">{t('labels.profile')}</TabsTrigger>
          <TabsTrigger value="preferences">
            {t('labels.preferences')}
          </TabsTrigger>
          <TabsTrigger value="account">{t('labels.account')}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSection user={user} onUpdate={handleProfileUpdate} />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <PreferencesSection
            preferences={preferences}
            onUpdate={handlePreferencesUpdate}
          />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <AccountSection onPasswordChange={handlePasswordChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
