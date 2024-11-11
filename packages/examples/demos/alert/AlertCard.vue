<script setup>
  import { ALERT_VARIANT } from '@/components/alert/alert.ts';
  import AcvAlert from '@/components/alert/alert.vue';
  import AcvLink from '@/components/link/link.vue';
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-2">
    <AcvAlert
      v-for="color in ALERT_VARIANT"
      :key="color"
      :color="color"
      title="Title"
      description="Description"
      show-border
      show-icon
      show-close
    >
      <template #actions>
        <AcvLink>First action</AcvLink>
        <AcvLink>Second action</AcvLink>
      </template>
    </AcvAlert>
  </div>
</template>
