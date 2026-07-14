import {
  AuthLayout,
  AuthLayoutCard,
  AuthLayoutFooter,
  AuthLayoutLogo,
  Button,
  Card,
  CardContent,
  InputText,
  Link,
} from '@constructor-lab/ui-react';

export function AuthScreenDemo() {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <AuthLayout>
        <AuthLayoutCard>
          <AuthLayoutLogo>
            <span className="text-base font-semibold">Constructor Lab</span>
          </AuthLayoutLogo>
          <Card>
            <CardContent>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <InputText
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
                <InputText label="Password" type="password" required />
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>
            </CardContent>
          </Card>
          <AuthLayoutFooter>
            <Link href="#">Forgot password?</Link>
          </AuthLayoutFooter>
        </AuthLayoutCard>
      </AuthLayout>
    </div>
  );
}
