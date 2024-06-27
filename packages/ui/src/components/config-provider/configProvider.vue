<script setup lang="ts">
  import { inject, provide } from 'vue';
  import { merge } from 'lodash-es';
  import type {
    AcvConfigProviderProps,
    AcvConfigProviderSlots
  } from './configProvider.ts';
  import {
    ACV_CONFIG_OPTIONS
  } from './configProvider.ts';

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
