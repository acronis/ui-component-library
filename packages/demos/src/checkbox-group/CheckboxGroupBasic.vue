<script setup>
  const checkboxGroup = ['Mon', 'Wed', 'Fri', 'Sun'];
  const items = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
</script>

<template>
  <AcvCheckboxGroup v-model="checkboxGroup">
    <AcvCheckboxButton
      v-for="item in items"
      :key="item"
      :label="item"
    />
  </AcvCheckboxGroup>
</template>
