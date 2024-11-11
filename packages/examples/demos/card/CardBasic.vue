<script setup>
  import AcvCard from '@/components/card/card.vue';
  import AcvTypography from '@/components/typography/typography.vue';
  import cardMock from '../../__mocks__/data.mock.card.js';
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-2">
    <AcvCard>
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      />
    </AcvCard>
    <AcvCard>
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
      />
      <p>{{ cardMock.text }}</p>
    </AcvCard>
  </div>
</template>
