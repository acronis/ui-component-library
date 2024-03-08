<template>
  <div class="qa-button-group-checkbox">
    <el-checkbox-group v-model="checkboxGroup">
      <el-checkbox-button v-for="item in items" :label="item" :key="item"></el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import ElCheckboxGroup from 'packages/checkbox';
  import ElCheckboxButton from 'packages/checkbox';

  const checkboxGroup = ref(['Mon', 'Wed', 'Fri', 'Sun']);
  const items = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
</script>
