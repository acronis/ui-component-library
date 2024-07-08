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
    >
      <AcvButton
        :class="state"
        color="success"
      >
        Button solid {{ state }}
      </AcvButton>
      <AcvButton
        :class="state"
        variant="outline"
        color="success"
      >
        Button outline  {{ state }}
      </AcvButton>
      <AcvButton
        :class="state"
        variant="ghost"
        color="success"
      >
        Button ghost {{ state }}
      </AcvButton>
    </div>
  </div>
</template>

<style scoped>
.acv-button {
  margin-block: 10px;
  width: 100%;
}
</style>
