<script setup>
  import AcvCarousel from '@/components/carousel/carousel.vue';
  import AcvCarouselItem from '@/components/carousel-item/carouselItem.vue';
</script>

<template>
  <AcvCarousel>
    <AcvCarouselItem name="1">
      First
    </AcvCarouselItem>
    <AcvCarouselItem name="2">
      Second
    </AcvCarouselItem>
    <AcvCarouselItem name="3">
      Third
    </AcvCarouselItem>
  </AcvCarousel>
</template>

<style scoped>
.custom-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: hsl(75deg 68% 45%);
}

.acv-carousel__item:nth-child(even) {
  .custom-slide {
    background-color: hsl(215deg 68% 34%);
    color: hsl(49deg 100% 88%);
  }
}
</style>
