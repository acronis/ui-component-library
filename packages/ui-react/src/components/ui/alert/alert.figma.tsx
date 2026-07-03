// Figma Code Connect — status: COMPLETE
// Mapped to the "Alert" component set in the ui-react Figma file (node 4313-4953).
// Figma `Type` → the ui-react `variant` (Unknown = neutral); `Dismissable` renders
// AlertClose; `Show Icon` renders AlertIcon.
import figma from '@figma/code-connect';

import {
  Alert,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from './alert';

figma.connect(
  Alert,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4313-4953',
  {
    props: {
      variant: figma.enum('Type', {
        Info: 'info',
        Success: 'success',
        Warning: 'warning',
        Critical: 'critical',
        'Error/Destructive': 'destructive',
        Unknown: 'neutral',
        AI: 'ai',
      }),
      icon: figma.boolean('Show Icon', {
        true: <AlertIcon />,
        false: undefined,
      }),
      close: figma.boolean('Dismissable', {
        true: <AlertClose />,
        false: undefined,
      }),
      title: figma.string('Title'),
      description: figma.string('Description'),
    },
    example: ({ variant, icon, close, title, description }) => (
      <Alert variant={variant}>
        {icon}
        <AlertContent>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </AlertContent>
        {close}
      </Alert>
    ),
  }
);
