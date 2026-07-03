// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from the legacy shadcn UI kit without a "ready for dev" Figma node. A Figma node would
// map the caption layout + selection mode. Replace 'FIGMA_NODE_URL' and flip to
// COMPLETE via `/figma-component Calendar <url> --update`.
import figma from '@figma/code-connect';

import { Calendar } from './calendar';

figma.connect(Calendar, 'FIGMA_NODE_URL', {
  example: () => <Calendar mode="single" />,
});
