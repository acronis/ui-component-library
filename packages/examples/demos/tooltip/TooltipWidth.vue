<script setup>
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvTooltip from '@/components/tooltip/tooltip.vue';
  import { IconAttention16 } from '@acronis-platform/icons/attention';

  const longContent = 'Lorem ipsum dolor sit amet, consectet adipisicing elit. '.repeat(10);
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Default"
      span="8"
    >
      <AcvTooltip
        :content="longContent"
        placement="top"
      >
        <AcvIcon
          :icon="IconAttention16"
          color="brand-primary"
        />
      </AcvTooltip>
    </Preview>
    <Preview
      name="Number"
      span="8"
    >
      <AcvTooltip
        :content="longContent"
        placement="top"
        :max-width="500"
      >
        <AcvIcon
          :icon="IconAttention16"
          color="brand-primary"
        />
      </AcvTooltip>
    </Preview>
    <Preview
      name="Auto width"
      span="8"
    >
      <AcvTooltip
        :content="longContent"
        placement="top"
        max-width="auto-width"
      >
        <AcvIcon
          :icon="IconAttention16"
          color="brand-primary"
        />
      </AcvTooltip>
    </Preview>
  </PreviewGroup>
</template>
