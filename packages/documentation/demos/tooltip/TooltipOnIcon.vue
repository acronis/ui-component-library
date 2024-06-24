<script setup>
  import InfoCircleOSmall from '@acronis-platform/icons/es/acronis/info/InfoCircleOSmall.vue';
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvTooltip from '@/components/tooltip/tooltip.vue';
</script>

<template>
  <AcvTooltip
    content="Lorem ipsum dolor sit amet, consectet adipisicing elit."
    placement="top"
  >
    <AcvIcon
      :icon="InfoCircleOSmall"
      name="i-info-circle-o--16"
      color="brand-primary"
    />
  </AcvTooltip>
</template>
