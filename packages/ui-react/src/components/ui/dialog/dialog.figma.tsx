// Figma Code Connect — status: COMPLETE
// Dialog is a compositional overlay primitive: the root carries no
// variant/size-driven props. The Figma component set (node 6343:58898)
// enumerates content recipes via a `variant` prop (default / rename /
// save-changes / …); those are compositions over these parts (see the
// `confirm-dialog` composite), so the example shows the default composition
// rather than a Figma-prop mapping.
import figma from '@figma/code-connect';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

figma.connect(
  Dialog,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6343-58898',
  {
    example: () => (
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
          </DialogHeader>
          <DialogBody>Drop any content into this slot.</DialogBody>
          <DialogFooter>Actions</DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  }
);
