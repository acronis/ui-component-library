<script setup>
  import { IconPlaceholder16 } from '@acronis-platform/icons/placeholder';
  import { BUTTON_TYPE } from '@/components/button/button.ts';

  import Button from '@/components/button/button.vue';

  const props = defineProps({
    size: {
      type: String
    },
  });

  const buttonTypes = [
    'primary',
    'secondary',
    'ghost',
    'danger',
    'inverted',
  ];

  const buttonStates = [
    '',
    'hover',
    'active',
    'focus',
    'disabled'
  ];

  const iconColor = {
    primary: 'acv-text-color-white',
    secondary: 'acv-text-color-nav-primary',
    ghost: 'acv-text-color-nav-primary',
    danger: 'acv-text-color-white',
    inverted: 'acv-text-color-white',
  };
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-5">
    <div
      v-for="type in buttonTypes"
      :key="type"
      align="center"
      :width="8"
      :class="{
        'acv-bg-nav-primary': type === BUTTON_TYPE.inverted,
        'acv-text-color-white': type === BUTTON_TYPE.inverted,
      }"
    >
      <div
        v-for="state in buttonStates"
        :key="state"
        class="pa-16"
      >
        <h4>{{ state ?? 'default' }} {{ type }}</h4>
        <Button
          :type="type"
          :class="state"
          :size="props.size"
        >
          <IconPlaceholder16
            :title="`${state} ${type}`"
            :class="iconColor[type]"
          />
        </Button>
      </div>
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
  margin-inline: auto;
}

.acv-icon {
  width: 16px;
  height: 16px;
}
</style>
