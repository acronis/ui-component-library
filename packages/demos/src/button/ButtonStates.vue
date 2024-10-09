<script setup>
  import { BUTTON_TYPE } from '@/components/button/button.ts';
  import Button from '@/components/button/button.vue';
  import { IconAcronisIcon32 } from '@acronis-platform/icons/acronis';

  const buttonTypes = [
    'primary',
    'secondary',
    'ghost',
    'inverted',
    'danger'
  ];
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-3">
    <div
      v-for="type in buttonTypes"
      :key="type"
      align="center"
      :width="8"
      :class="{
        'acv-bg-nav-primary': type === BUTTON_TYPE.inverted,
      }"
    >
      <Button :type="type">
        <IconAcronisIcon32 />
        Default {{ type }}
      </Button>
      <Button
        :type="type"
        class="hover"
      >
        Hover {{ type }}
      </Button>
      <Button
        :type="type"
        class="active"
      >
        Active {{ type }}
      </Button>
      <Button
        :type="type"
        class="focus"
      >
        Focus {{ type }}
      </Button>
      <Button
        :type="type"
        disabled
      >
        Disabled {{ type }}
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
    display: block;
  }
</style>
