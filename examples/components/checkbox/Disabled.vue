<template>
      <preview-group class="qa-checkbox-disabled">
        <preview span="6" name="Default">
          <el-checkbox :checked="value1" :disabled="disabled">Label</el-checkbox>
        </preview>
        <preview span="6" name="Checked">
          <el-checkbox :checked="value2" :disabled="disabled">Label</el-checkbox>
        </preview>
        <preview span="6" name="Indeterminate">
          <el-checkbox
            :indeterminate="indeterminate"
            v-model="value3"
            @change="handleChange"
            :disabled="disabled"
          >Label</el-checkbox>
        </preview>
        <preview span="6" name="Long label">
          <el-checkbox
            :checked="value4"
            show-hover-hint
            :disabled="disabled"
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
          </el-checkbox>
        </preview>
        <preview span="12" name="Long multi line label">
          <el-checkbox
            :checked="value4"
            show-hover-hint
            multiline-label
            :disabled="disabled"
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
          </el-checkbox>
        </preview>
        <preview span="12" name="Long multi line label with limit">
          <el-checkbox
            :checked="value4"
            show-hover-hint
            multiline-label
            :multiline-label-limit="3"
            :disabled="disabled"
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
          </el-checkbox>
        </preview>
        <preview span="24" name="Description">
          <el-checkbox :checked="value5" :disabled="disabled">
            Label
            <template v-slot:description>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.</template>
          </el-checkbox>
        </preview>
      </preview-group>
</template>

<script setup>
import { ref } from 'vue';

import ElCheckbox from 'packages/checkbox';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const value1 = ref(false);
const value2 = ref(true);
const value3 = ref(false);
const value4 = ref(false);
const value5 = ref(false);
const indeterminate = ref(false);
const counter = ref(1);

const disabled = ref(true);

const handleChange = () => {
  switch (counter.value % 3) {
    case 0:
    indeterminate.value = true;
      break;
    case 1:
      indeterminate.value = false;
      value3.value = false;
      break;
    case 2:
    default:
    indeterminate.value = false;
      value3.value = true;
      break;
  }
  counter.value++;
};
</script>
