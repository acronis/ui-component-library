<script setup lang="ts">
  import type {
    AcvConfigProviderProps,
    AcvConfigProviderSlots
  } from '@/components/__todo__/config-provider/configProvider.ts';
  import {
    ACV_CONFIG_OPTIONS
  } from '@/components/__todo__/config-provider/configProvider.ts';
  import { merge } from 'lodash-es';
  import { inject, provide } from 'vue';

  defineOptions({
    name: 'AcvConfigProvider'
  });

  const { props } = defineProps<AcvConfigProviderProps>();

  defineSlots<AcvConfigProviderSlots>();

  const defaultProps = inject(ACV_CONFIG_OPTIONS, { props: {} });

  provide(
    ACV_CONFIG_OPTIONS,
    merge(defaultProps, props)
  );
</script>

<template>
  <slot />
</template>
