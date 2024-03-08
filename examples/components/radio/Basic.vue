<template>
  <preview-group class="qa-radio-basic">
    <preview span="6" name="Default">
      <el-radio v-model="value1" label="1">Label</el-radio>
    </preview>
    <preview span="6" name="Checked">
      <el-radio v-model="value1" label="2">Label</el-radio>
    </preview>
    <preview span="12" name="Long label">
      <el-radio v-model="value1" label="3" show-hover-hint>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
      </el-radio>
    </preview>
    <preview span="24" name="Description">
      <el-radio v-model="value1" label="4">
        Label
        <template v-slot:description>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.</template>
      </el-radio>
    </preview>
  </preview-group>
</template>

<script setup>
import { ref } from 'vue';

import ElRadio from 'packages/radio';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const value1 = ref('2');
</script>