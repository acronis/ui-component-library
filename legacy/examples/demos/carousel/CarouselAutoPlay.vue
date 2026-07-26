<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvCarousel from '@/components/carousel/carousel.vue';
  import AcvCarouselItem from '@/components/carousel-item/carouselItem.vue';
  import { ref } from 'vue';

  const value = ref();
  const autoplay = ref(false);
  const cycle = ref(true);
</script>

<template>
  <AcvCarousel
    v-model="value"
    :cycle="cycle"
    :autoplay="autoplay"
  >
    <AcvCarouselItem>
      First
    </AcvCarouselItem>
    <AcvCarouselItem>
      Second
    </AcvCarouselItem>
    <AcvCarouselItem>
      Third
    </AcvCarouselItem>
  </AcvCarousel>
  <div class="control">
    <AcvButton
      v-if="!autoplay"
      @click="autoplay = !autoplay"
    >
      Start autoplay
    </AcvButton>
    <AcvButton
      v-else
      @click="autoplay = !autoplay"
    >
      Stop autoplay
    </AcvButton>

    <AcvButton
      v-if="!cycle"
      @click="cycle = !cycle"
    >
      Enable cycle
    </AcvButton>
    <AcvButton
      v-else
      @click="cycle = !cycle"
    >
      Disable cycle
    </AcvButton>
  </div>
</template>

<style scoped>
.acv-carousel {
  margin: 200px auto;
  width: 500px;
}

.control {
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
