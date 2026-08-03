// Figma Code Connect — status: COMPLETE
// Mapped to the "Toast" component set (node 7421:126262), the set that also
// carries the `--ui-toast-*` tier this component now binds. Its properties,
// confirmed via get_context_for_code_connect:
//   `Property 1`  variant  Info | Success | Warning | Critical | Danger
//   `Title`, `Description`   TEXT
//   `Dismissable`            BOOLEAN → the close ButtonIcon's visibility
//   `Show Actions`           BOOLEAN + `ActionsContainer` SLOT
//
// The React API is imperative, so there is no per-status component to attach the
// variant to: render <Toaster /> once at the app root and call the matching
// `toast.*` for the status. The mapping therefore renders the *call* for the
// selected variant, which is the snippet a consumer actually needs — with the
// design's `Danger` shown as `toast.error`, this component's name for it.
import figma from '@figma/code-connect';

import { toast, Toaster } from './toast';

figma.connect(
  Toaster,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7421-126262',
  {
    props: {
      title: figma.string('Title'),
      description: figma.string('Description'),
      call: figma.enum('Property 1', {
        Info: 'info',
        Success: 'success',
        Warning: 'warning',
        Critical: 'critical',
        Danger: 'error',
      }),
    },
    example: ({ title, description, call }) => (
      // Render once at the app root…
      <>
        <Toaster />
        {/* …then show a toast of this status from anywhere: */}
        {toast[call](title, { description })}
      </>
    ),
  }
);
