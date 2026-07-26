<script setup>
  import AcvCard from '@/components/card/card.vue';
  import AcvTypography from '@/components/typography/typography.vue';
  import cardMock from '../../__mocks__/data.mock.card.js';
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-2">
    <AcvCard>
      <AcvTypography
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      >
        <template #title>
          <div class="flex justify-between">
            <span>{{ cardMock.title }}</span>
            <div class="flex items-center gap-x-3 text-base text-light-emphasis">
              <i class="cursor-pointer i-bx-chevron-down" />
              <i class="cursor-pointer i-bx-refresh" />
              <i class="cursor-pointer i-bx-x" />
            </div>
          </div>
        </template>
      </AcvTypography>
    </AcvCard>
    <AcvCard>
      <div class="acv-card-padding">
        <AcvTypography
          :subtitle="cardMock.subtitle"
          :text="cardMock.text"
        >
          <template #title>
            <div class="flex justify-between items-center">
              <span>Card title</span>
              <a
                target="_blank"
                href="https://github.com/jd-solanki/anu"
                class="!text-light-emphasis underline text-sm"
              >
                Link
              </a>
            </div>
          </template>
        </AcvTypography>
      </div>
    </AcvCard>
  </div>
</template>
