<script setup>
  const shadows = [
    'small',
    'regular',
    'large',
    'extra-large',
    'extra-extra-large',
    'extra-extra-extra-large',
  ];
</script>

<template>
  <article class="acv-shadows-tokens">
    <div
      v-for="shadow in shadows"
      :key="shadow"
      class="shadow"
      :style="{ boxShadow: `var(--acv-shadow-${shadow})` }"
    >
      {{ shadow }}
    </div>
  </article>
</template>

<style scoped>
.acv-shadows-tokens {
  display: flex;
  flex-flow: row wrap;
  gap: var(--acv-size-16px);
}

.acv-shadows-tokens .shadow {
  background: var(--acv-color-white);
  inline-size: var(--acv-size-160px);
  aspect-ratio: var(--acv-ratio-square);
  border-radius: var(--acv-border-radius-regular);
  display: grid;
  place-content: center;
}
</style>
