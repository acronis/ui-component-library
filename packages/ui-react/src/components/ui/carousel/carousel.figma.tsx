// Figma Code Connect — status: NEEDS_FIGMA_URL
// No "ready for dev" Carousel node yet. Props are mapped from the ported
// contract; swap FIGMA_NODE_URL and set status COMPLETE via
// `/figma-component Carousel <url> --update` once a mockup lands.
import figma from '@figma/code-connect';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from './carousel';

figma.connect(Carousel, 'FIGMA_NODE_URL', {
  props: {
    orientation: figma.enum('orientation', {
      horizontal: 'horizontal',
      vertical: 'vertical',
    }),
  },
  example: ({ orientation }) => (
    <Carousel orientation={orientation}>
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
      </CarouselContent>
      <CarouselNavigation />
    </Carousel>
  ),
});
