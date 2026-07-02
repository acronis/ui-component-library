// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. AspectRatio is a
// layout-only primitive (a `ratio` prop, no variants), so a Figma node would map
// little beyond the ratio. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component AspectRatio <url> --update`.
import figma from '@figma/code-connect';

import { AspectRatio } from './aspect-ratio';

figma.connect(AspectRatio, 'FIGMA_NODE_URL', {
  example: () => (
    <AspectRatio ratio={16 / 9}>
      <img className="h-full w-full object-cover" src="/cover.jpg" alt="" />
    </AspectRatio>
  ),
});
