<script setup>
  import cardMock from '../__data__/data.mock.card.js';
  import AcvCard from '@/components/card/card.vue';
  import AcvTypography from '@/components/typography/typography.vue';
  import AcvButton from '@/components/button/button.vue';
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-2">
    <AcvCard
      variant="solid"
      color="primary"
    >
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
      />
      <img
        :src="cardMock.image"
        alt="placeholder"
      >
      <div class="acv-card-body">
        <p>{{ cardMock.text }}</p>
      </div>
    </AcvCard>
    <AcvCard
      variant="ghost"
      color="primary"
      round
    >
      <img
        :src="cardMock.image"
        alt="placeholder"
      >
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      />
      <div class="acv-card-body">
        <AcvButton>Read more</AcvButton>
      </div>
    </AcvCard>
    <AcvCard
      variant="ghost"
      color="primary"
      :img="cardMock.image"
      round
    >
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      />
      <div class="acv-card-body">
        <AcvButton>Read more</AcvButton>
      </div>
    </AcvCard>
  </div>
</template>
