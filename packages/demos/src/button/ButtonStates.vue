<script setup>
  import { BUTTON_VARIANT } from '@/components/button/button.ts';
  import Button from '@/components/button/button.vue';
  import { IconAcronisIcon32 } from '@acronis-platform/icons/acronis';

  const buttonVariants = [
    'primary',
    'secondary',
    'ghost',
    'inverted',
    'status'
  ];
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-3">
    <div
      v-for="variant in buttonVariants"
      :key="variant"
      align="center"
      :class="{
        'acv-bg-nav-primary': variant === BUTTON_VARIANT.inverted,
      }"
    >
      <Button :variant="variant">
        <template #prepend>
          <IconAcronisIcon32 />
        </template>
        Default {{ variant }}
      </Button>
      <Button
        :variant="variant"
        class="acv-button_hover"
      >
        Hover {{ variant }}
      </Button>
      <Button
        :variant="variant"
        class="acv-button_active"
      >
        Active {{ variant }}
      </Button>
      <Button
        :variant="variant"
        class="acv-button_focus"
      >
        Focus {{ variant }}
      </Button>
      <Button
        :variant="variant"
        disabled
      >
        Disabled {{ variant }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
  .acv-cell {
    padding-block: 16px;
    padding-inline: 16px;
  }

  .acv-button {
    margin-block: 10px;
    display: flex;
  }
</style>
