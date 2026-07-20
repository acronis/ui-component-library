import { Navigate } from 'react-router-dom';
import {
  AuthLayout,
  AuthLayoutCard,
  AuthLayoutFooter,
  AuthLayoutLogo,
} from '@constructor-lab/ui-react';
import { LoginForm } from './LoginForm';
import { useAuth } from '../../hooks/useAuth';
import type { LoginFormData } from '../../lib/validators';

export function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <AuthLayout>
      <AuthLayoutCard>
        <AuthLayoutLogo>
          <span className="text-xl font-bold">Acronis</span>
        </AuthLayoutLogo>
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter any email and password to sign in to the demo
          </p>
        </div>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        <AuthLayoutFooter>
          <p>This is a demo with mock authentication.</p>
          <p className="mt-1">Any credentials will work!</p>
        </AuthLayoutFooter>
      </AuthLayoutCard>
    </AuthLayout>
  );
}
