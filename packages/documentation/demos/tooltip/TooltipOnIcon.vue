<script setup>
  import { IconInfo16 } from '@acronis-platform/icons/info';
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvTooltip from '@/components/tooltip/tooltip.vue';
</script>

<template>
  <AcvTooltip
    content="Lorem ipsum dolor sit amet, consectet adipisicing elit."
    placement="top"
  >
    <AcvIcon
      :icon="IconInfo16"
      name="info-circle-o--16"
      color="brand-primary"
    />
  </AcvTooltip>
</template>
