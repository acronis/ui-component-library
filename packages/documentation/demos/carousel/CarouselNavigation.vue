<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvCarousel from '@/components/carousel/carousel.vue';
  import AcvCarouselItem from '@/components/carousel/carouselItem.vue';
</script>

<template>
  <AcvCarousel
    :height="120"
    :width="360"
    navigation-arrows="always"
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
    <template #nav-arrow-backward>
      <AcvButton
        icon="i-chevron-left--16"
        type="ghost"
      >
        Previous
      </AcvButton>
    </template>
    <template #nav-arrow-forward>
      <AcvButton
        icon="i-chevron-right--16"
        right-icon
        type="ghost"
      >
        Next
      </AcvButton>
    </template>
  </AcvCarousel>
</template>
