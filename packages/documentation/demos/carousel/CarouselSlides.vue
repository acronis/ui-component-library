<script setup>
  import AcvAlert from '@/components/alert/alert.vue';
  import AcvCarousel from '@/components/carousel/carousel.vue';
  import AcvCarouselItem from '@/components/carousel/carouselItem.vue';

  const items = [
    {
      name: 'one',
      content: 'First slide'
    },
    {
      name: 'two',
      content: 'Second slide'
    },
    {
      name: 'three',
      content: 'Third slide'
    },
    {
      name: 'four',
      content: 'Fourth slide'
    },
    {
      name: 'five',
      content: 'Fifth slide'
    },
    {
      name: 'six',
      content: 'Sixth slide'
    }
  ];
  const description = 'test description'.repeat(10);
</script>

<template>
  <AcvCarousel :slide-count="2">
    <AcvCarouselItem
      v-for="item in items"
      :key="item.name"
      :name="item.name"
    >
      <AcvAlert
        :title="item.content"
        :description="description"
        type="error"
        show-icon
        card
      />
    </AcvCarouselItem>
  </AcvCarousel>
</template>
