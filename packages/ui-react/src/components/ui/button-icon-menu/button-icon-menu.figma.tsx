// Figma Code Connect — status: COMPLETE
// Mapped to the "ButtonIconMenu" component in the ui-react Figma file. The only
// design property is `state`; idle/hover/disabled/focus are interaction states
// handled in CSS, and `active` is the **open** state → maps to the `open` prop.
import figma from '@figma/code-connect';

import { ButtonIconMenu } from './button-icon-menu';

figma.connect(
  ButtonIconMenu,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3116-62813',
  {
    props: {
      open: figma.enum('state', { active: true }),
    },
    example: ({ open }) => (
      <ButtonIconMenu open={open} aria-label="More options" />
    ),
  }
);
