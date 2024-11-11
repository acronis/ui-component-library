<script setup>
  import { BUTTON_VARIANT } from '@/components/button/button.ts';
  import Button from '@/components/button/button.vue';

  const buttonVariants = [
    'primary',
    'secondary',
    'ghost',
    'status',
    'inverted',
  ];

  const buttonStates = [
    '',
    'hover',
    'active',
    'disabled'
  ];
</script>

<template>
  <div class="acv-button-doc">
    <div
      v-for="variant in buttonVariants"
      :key="variant"
      :class="{
        'acv-bg-surface-fixed-primary': variant === BUTTON_VARIANT.inverted,
        'acv-text-color-white': variant === BUTTON_VARIANT.inverted,
      }"
    >
      <div
        v-for="state in buttonStates"
        :key="state"
        class="pa-12"
      >
        <Button
          :variant="variant"
          :class="{
            'acv-button_hover': state === 'hover',
            'acv-button_active': state === 'active',
            'acv-button_disabled': state === 'disabled',
          }"
          size="medium"
        >
          Button
        </Button>
      </div>
      <div
        v-for="state in buttonStates"
        :key="state"
        class="pa-12"
      >
        <Button
          :variant="variant"
          :class="{
            'acv-button_hover': state === 'hover',
            'acv-button_active': state === 'active',
            'acv-button_disabled': state === 'disabled',
          }"
          size="large"
        >
          Button
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.acv-button-doc {
  display: grid;
  grid-template-columns: repeat(5, 100px);
}
</style>
