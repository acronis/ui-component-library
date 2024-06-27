<script setup>
  import AcvCarousel from '@/components/carousel/carousel.vue';
  import AcvCarouselItem from '@/components/carousel/carouselItem.vue';
</script>

<template>
  <h3>Slide indicators triggered by hover</h3>
  <AcvCarousel
    :height="120"
    trigger-type="hover"
  >
    <AcvCarouselItem class="custom-slide">
      First slide
    </AcvCarouselItem>
    <AcvCarouselItem class="custom-slide">
      Second slide
    </AcvCarouselItem>
    <AcvCarouselItem class="custom-slide">
      Third slide
    </AcvCarouselItem>
  </AcvCarousel>
</template>
