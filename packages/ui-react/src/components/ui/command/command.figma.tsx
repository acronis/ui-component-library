// Figma Code Connect — status: NEEDS_FIGMA_URL
// No "ready for dev" Command node yet. Props are mapped from the ported contract;
// swap FIGMA_NODE_URL and set status COMPLETE via
// `/figma-component Command <url> --update` once a mockup lands.
import figma from '@figma/code-connect';

import { Command } from './command';

figma.connect(Command, 'FIGMA_NODE_URL', {
  example: () => (
    <Command
      commands={[
        {
          heading: 'Suggestions',
          items: [
            { value: 'calendar', label: 'Calendar' },
            { value: 'search', label: 'Search', shortcut: '⌘S' },
          ],
        },
      ]}
      placeholder="Type a command…"
    />
  ),
});
