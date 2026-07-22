// Figma Code Connect — status: COMPLETE
// The Figma "Notification" set (node 6946-25164) is a single-toast banner, but
// the ui-react toast is imperative: render <Toaster /> once at the app root and
// call toast.success(...) / toast.error(...) to show one. Code Connect binds the
// region (there is no standalone banner component to attach the `style` variant
// to); the per-status styling is driven by the toast's `type` at call time.
import figma from '@figma/code-connect';

import { Toaster } from './toast';

figma.connect(
  Toaster,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6946-25164',
  {
    example: () => <Toaster />,
  }
);
