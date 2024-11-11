<script setup lang="ts">
  import GoFormControl from '@/components/__dev__/GoForm/GoFormControl.vue';
  import GoFormStatic from '@/components/__dev__/GoForm/GoFormStatic.vue';

  withDefaults(
    defineProps<{
      class?: string
      hint?: string
      label?: string
      error?: boolean
      fixedWidth?: boolean
      optional?: boolean
    }>(),
    {
      error: true,
    },
  );
</script>

<template>
  <GoFormControl
    :class="$props.class"
    :label="label"
    :hint="hint"
    :fixed-width="fixedWidth"
    :error="error"
    :optional="optional"
  >
    <GoFormStatic>
      <slot />
    </GoFormStatic>
  </GoFormControl>
</template>

<style scoped></style>
