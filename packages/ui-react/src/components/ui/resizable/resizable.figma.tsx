// Figma Code Connect — status: COMPLETE
// Mapped to the "Resizable" component in the ui-react Figma file — the draggable
// handle (a 1px divider line: idle gray, hover/active blue, focus ring). It has
// no variant properties; the example shows the handle composed into a panel group
// so the snippet documents real usage.
import figma from '@figma/code-connect';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

figma.connect(
  ResizableHandle,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4649-6681',
  {
    example: () => (
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>Panel one</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Panel two</ResizablePanel>
      </ResizablePanelGroup>
    ),
  }
);
