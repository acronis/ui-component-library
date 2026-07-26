<script setup>
  import AcvButton from '@/components/button/button.vue';

  const buttonStates = [
    '',
    'hover',
    'active',
    'focus',
    'disabled'
  ];
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-5">
    <div
      v-for="state in buttonStates"
      :key="state"
      :width="3"
      align="center"
    >
      <AcvButton
        :class="state"
        variant="outline"
      >
        Solid {{ state }}
      </AcvButton>
      <AcvButton
        :class="state"
        variant="outline"
      >
        Outline  {{ state }}
      </AcvButton>
      <AcvButton
        :class="state"
        variant="ghost"
        color="secondary"
      >
        Ghost {{ state }}
      </AcvButton>
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
  width: 100%;
}
</style>
