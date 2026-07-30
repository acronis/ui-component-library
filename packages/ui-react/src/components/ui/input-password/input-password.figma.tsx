// Figma Code Connect — status: COMPLETE
// Mapped to the "InputPassword" component set in the ui-react Figma file.
import figma from '@figma/code-connect';

import { InputPassword } from './input-password';

figma.connect(
  InputPassword,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6325-11375',
  {
    props: {
      // The `error` text drives the error treatment — only `variant="error"`
      // renders a message, so the variant maps straight onto the prop.
      error: figma.enum('variant', { error: 'Error message' }),
      // `password` (hidden / shown) is the reveal state. It is component state
      // in code, so the design's value seeds the uncontrolled default.
      defaultRevealed: figma.enum('password', { shown: true }),
      // `state` (idle / hover / focused / focused-icon / disabled) is otherwise a
      // runtime pseudo-state; `content` (placeholder / value) is the field value.
      disabled: figma.enum('state', { disabled: true }),
    },
    example: ({ error, defaultRevealed, disabled }) => (
      <InputPassword
        label="Label"
        placeholder="Password"
        error={error}
        defaultRevealed={defaultRevealed}
        disabled={disabled}
      />
    ),
  }
);
