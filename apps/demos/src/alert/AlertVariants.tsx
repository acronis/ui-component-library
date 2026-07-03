import {
  Alert,
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from '@spec-lab/ui-react';
import {
  CircleCheckIcon,
  TriangleWarningIcon,
  DiamondWarningIcon,
  CircleWarningIcon,
  ServerIcon,
  CircleInfoIcon,
  SparklesIcon,
} from '@spec-lab/icons-react/stroke-mono';

export function AlertVariants() {
  return (
    <div className="flex flex-col gap-4">
      <Alert variant="ai">
        <AlertIcon>
          <SparklesIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>
            This is an AI-powered alert message.
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="neutral">
        <AlertIcon>
          <ServerIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>
            This is a neutral informational alert message.
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="success">
        <AlertIcon>
          <CircleCheckIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>Operation completed successfully!</AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="warning">
        <AlertIcon>
          <TriangleWarningIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>
            Please review this warning before proceeding.
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="critical">
        <AlertIcon>
          <DiamondWarningIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>
            Critical issue detected that requires immediate attention.
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="destructive">
        <AlertIcon>
          <CircleWarningIcon />
        </AlertIcon>
        <AlertContent>
          <AlertDescription>
            Danger! This action cannot be undone.
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Alert variant="info">
        <AlertIcon>
          <CircleInfoIcon />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>System Update Available</AlertTitle>
          <AlertDescription>
            A new version is ready to install. Click here to update now.
          </AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  );
}
