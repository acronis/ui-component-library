<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDrawer from '@/components/drawer/drawer.vue';
  import AcvTypography from '@/components/typography/typography.vue';
  import { ref } from 'vue';
  import cardMock from '../../__mocks__/data.mock.card.js';

  const isDrawerShown = ref(false);
</script>

<template>
  <AcvDrawer
    v-model="isDrawerShown"
    persistent
  >
    <div class="a-card-body">
      <AcvTypography
        :title="cardMock.title"
        :subtitle="cardMock.subtitle"
        :text="cardMock.text"
      />
      <AcvButton
        class="text-sm"
        @click="isDrawerShown = false"
      >
        Close
      </AcvButton>
    </div>
  </AcvDrawer>

  <AcvButton @click="isDrawerShown = true">
    Show drawer
  </AcvButton>
</template>
