<script setup>
  import AcvCarousel from '@/components/carousel/carousel.vue';
  import AcvCarouselItem from '@/components/carousel/carouselItem.vue';
</script>

<template>
  <AcvCarousel
    :width="200"
    :height="120"
  >
    <AcvCarouselItem>
      <div
        class="custom-slide"
        style="background-color:hsl(0deg 0% 40%); height: 60px; color: var(--acv-color-white);"
      >
        First slide
      </div>
    </AcvCarouselItem>
    <AcvCarouselItem>
      <div
        class="custom-slide"
        style="background-color:hsl(0deg 0% 13%); height: 100px; color: var(--acv-color-white);"
      >
        Second slide
      </div>
    </AcvCarouselItem>
    <AcvCarouselItem>
      <div
        class="custom-slide"
        style="background-color:hsl(0deg 0% 73%); height: 120px; color: var(--acv-color-white);"
      >
        Third slide
      </div>
    </AcvCarouselItem>
  </AcvCarousel>
</template>
