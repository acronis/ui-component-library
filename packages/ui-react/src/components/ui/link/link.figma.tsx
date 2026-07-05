// Figma Code Connect — status: COMPLETE
// Mapped to the "Link" component set in the ui-react Figma file.
import figma from '@figma/code-connect';

import { Link } from './link';

figma.connect(
  Link,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3741-981',
  {
    props: {
      label: figma.string('Label'),
      external: figma.boolean('External'),
      // The Figma `background` variant (normal / inverse) selects the colour set.
      variant: figma.enum('background', { normal: 'normal', inverse: 'inverse' }),
      // `state` (idle / hover / active / focused) is a pure interaction
      // pseudo-state; only `disabled` maps to a prop.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({ label, variant, external, disabled }) => (
      <Link href="#" variant={variant} external={external} disabled={disabled}>
        {label}
      </Link>
    ),
  }
);
