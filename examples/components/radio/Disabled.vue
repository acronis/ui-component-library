<template>
  <preview-group class="qa-radio-disabled">
    <preview span="6" name="Default">
      <el-radio v-model="value2" label="disabled" disabled>Label</el-radio>
    </preview>
    <preview span="6" name="Checked">
      <el-radio v-model="value2" label="selected and disabled" disabled>Label</el-radio>
    </preview>
    <preview span="12" name="Long label">
      <el-radio v-model="value2" label="3" show-hover-hint disabled>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
      </el-radio>
    </preview>
    <preview span="24" name="Description">
      <el-radio v-model="value2" label="4" disabled>
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

const value2 = ref('selected and disabled');
</script>