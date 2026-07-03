// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the legacy shadcn UI kit without a "ready for dev" Figma node. A Figma node would
// map the group's `orientation` and its segmented children. Replace
// 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component ButtonGroup <url> --update`.
import figma from '@figma/code-connect';

import { ButtonGroup } from './button-group';

figma.connect(ButtonGroup, 'FIGMA_NODE_URL', {
  props: {
    orientation: figma.enum('orientation', {
      Horizontal: 'horizontal',
      Vertical: 'vertical',
    }),
  },
  example: ({ orientation }) => <ButtonGroup orientation={orientation} />,
});
