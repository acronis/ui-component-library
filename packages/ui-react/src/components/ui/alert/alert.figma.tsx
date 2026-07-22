// Figma Code Connect — status: COMPLETE
// Mapped to the redesigned "Alert" set (node 6768-67288). Figma `style` → the
// ui-react `variant` (Danger = destructive; the kit's `neutral`/`ai` extend the
// design). The multicolor status icon is variant-driven — `AlertIcon` renders it
// by default. `dismissable` renders AlertClose; `hasDescription` renders
// AlertDescription.
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
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6768-67288',
  {
    props: {
      variant: figma.enum('style', {
        Info: 'info',
        Success: 'success',
        Warning: 'warning',
        Critical: 'critical',
        Danger: 'destructive',
      }),
      description: figma.boolean('hasDescription', {
        true: <AlertDescription>Description</AlertDescription>,
        false: undefined,
      }),
      close: figma.boolean('dismissable', {
        true: <AlertClose />,
        false: undefined,
      }),
    },
    example: ({ variant, description, close }) => (
      <Alert variant={variant}>
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Title</AlertTitle>
          {description}
        </AlertContent>
        {close}
      </Alert>
    ),
  }
);
