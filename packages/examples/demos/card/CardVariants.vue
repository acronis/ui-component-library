<script setup>
  import AcvCard from '@/components/card/card.vue';
  import AcvTypography from '@/components/typography/typography.vue';
  import cardMock from '../../__mocks__/data.mock.card.js';
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
        :text="cardMock.text"
      />
    </AcvCard>
    <AcvCard
      variant="ghost"
      color="primary"
    >
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      />
    </AcvCard>
    <AcvCard
      variant="outline"
      color="primary"
      :shadow="false"
    >
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      />
    </AcvCard>
    <AcvCard
      variant="text"
      color="primary"
    >
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      />
    </AcvCard>
    <AcvCard
      variant="solid"
      color="red"
    >
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      />
    </AcvCard>
    <AcvCard
      variant="solid"
      color="green"
      border
      states
    >
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      />
    </AcvCard>
    <AcvCard
      variant="solid"
      color="#4682b4"
      states
    >
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      />
    </AcvCard>
  </div>
</template>
