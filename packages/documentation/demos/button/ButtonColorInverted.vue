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
  <div class="acv-grid-row acv-grid--cols-5 acv-bg-nav-primary px-16">
    <div
      v-for="state in buttonStates"
      :key="state"
    >
      <AcvButton
        :class="state"
        color="inverted"
      >
        Solid {{ state }}
      </AcvButton>
      <AcvButton
        :class="state"
        variant="outline"
        color="inverted"
      >
        Outline  {{ state }}
      </AcvButton>
      <AcvButton
        :class="state"
        variant="ghost"
        color="inverted"
      >
        Ghost {{ state }}
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
