<template>
  <preview-group>
    <preview name="Disabled button" span="6">
      <el-tooltip content="Put the disabled button within a <div> or <span>">
        <div>
          <el-button disabled>Button</el-button>
        </div>
      </el-tooltip>
    </preview>
    <preview span="6">
      <el-tooltip :content="isButtonDisabled ? 'Message for disabled state' : 'Message for normal state'">
        <div>
          <el-button :disabled="isButtonDisabled">Button</el-button>
        </div>
      </el-tooltip>
      <el-checkbox v-model="isButtonDisabled" class="mt-16">Toggle disabled</el-checkbox>
    </preview>
  </preview-group>
</template>

<script setup>
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
import ElTooltip from 'packages/tooltip';
import ElButton from 'packages/button';
import ElCheckbox from 'packages/checkbox';
import { ref } from 'vue';

const isButtonDisabled = ref(false);
</script>
