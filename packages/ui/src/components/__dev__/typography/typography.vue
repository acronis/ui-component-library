<script lang="ts" setup>
  import type { AcvTypographyProps, AcvTypographySlots } from '@/components/__dev__/typography/typography.ts';

  defineOptions({
    name: 'AcvTypography'
  });

  const {
    title,
    subtitle,
    text,
    titleTag = 'p',
    subtitleTag = 'p',
    textTag = 'p'
  } = defineProps<AcvTypographyProps>();

  defineSlots<AcvTypographySlots>();
</script>

<template>
  <div class="acv-typography">
    <div
      v-if="$slots.title || title || $slots.subtitle || subtitle || $slots['header-right']"
      class="title-wrapper"
    >
      <div class="flex-grow">
        <Component
          :is="titleTag"
          v-if="title || $slots.title"
          class="acv-title"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </Component>
        <Component
          :is="subtitleTag"
          v-if="subtitle || $slots.subtitle"
          class="acv-subtitle"
        >
          <slot name="subtitle">
            {{ subtitle }}
          </slot>
        </Component>
      </div>
      <slot name="header-right" />
    </div>
    <Component
      :is="textTag"
      v-if="text || $slots.default"
      class="acv-text"
    >
      <slot>
        {{ text }}
      </slot>
    </Component>
  </div>
</template>

<style scoped>
  .acv-typography {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .title-wrapper {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
