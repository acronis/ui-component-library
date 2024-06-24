<script setup>
  import AcvCarousel from '@/components/carousel/carousel.vue';
  import AcvCarouselItem from '@/components/carousel/carouselItem.vue';

  const items = [{
    name: 'one',
    content: 'First slide'
  }, {
    name: 'two',
    content: 'Second slide'
  }, {
    name: 'three',
    content: 'Third slide'
  }, {
    name: 'four',
    content: 'Fourth slide'
  }, {
    name: 'five',
    content: 'Fifth slide'
  }, {
    name: 'six',
    content: 'Sixth slide'
  }];
</script>

<template>
  <AcvCarousel
    :height="200"
  >
    <AcvCarouselItem
      v-for="item in items"
      :key="item.name"
      :name="item.name"
    >
      <div class="custom-slide">
        {{ item.content }}
      </div>
    </AcvCarouselItem>
  </AcvCarousel>
</template>

<style scoped>
.custom-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: hsl(75deg, 68%, 45%);
}

.acv-carousel__item:nth-child(even) {
  .custom-slide {
    background-color: hsl(215deg, 68%, 34%);
    color: hsl(49deg, 100%, 88%);
  }
}
</style>
