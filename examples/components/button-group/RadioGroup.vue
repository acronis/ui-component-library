<template>
  <div class="qa-button-group-radio">
    <div class="mb-16">
      <el-radio-group v-model="radioGroup">
        <el-radio-button v-for="item in items" :label="item" :key="item"></el-radio-button>
      </el-radio-group>
    </div>
    <el-radio-group v-model="smallRadioGroup" size="small">
      <el-radio-button v-for="icon in icons" :label="icon" :key="icon">
        <el-icon :name="icon" color="brand-primary"></el-icon>
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import ElRadioGroup from 'packages/radio';
  import ElRadioButton from 'packages/radio';
  import ElIcon from 'packages/icon';

  const radioGroup = ref('Mon');
  const smallRadioGroup = ref('i-pencil-o--16');
  const items = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const icons = ref(['i-pencil-o--16', 'i-cog--16', 'i-services-o--16']);
</script>
