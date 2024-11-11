<script setup>
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvTooltip from '@/components/tooltip/tooltip.vue';
  import { IconInfo16 } from '@acronis-platform/icons/info';
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
