'use client';

import {
  Alert,
  AlertActions,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from '@constructor-lab/ui-react';

export function AlertDemo() {
  return (
    <div className="flex flex-col gap-3" style={{ width: 420 }}>
      <Alert variant="info">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components to your app using the CLI.
          </AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="success">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Saved</AlertTitle>
          <AlertDescription>Your changes were saved.</AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="destructive">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </AlertContent>
      </Alert>
      <Alert variant="info">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Protect non-compliant devices</AlertTitle>
          <AlertDescription>
            Ensure a protection plan is applied and a scan has completed within
            the last 24 hours.
          </AlertDescription>
          <AlertActions className="mt-2">
            <Button>View devices</Button>
          </AlertActions>
        </AlertContent>
      </Alert>
      <Alert variant="warning">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Dismissible</AlertTitle>
          <AlertDescription>This alert can be closed.</AlertDescription>
        </AlertContent>
        <AlertClose />
      </Alert>
    </div>
  );
}
