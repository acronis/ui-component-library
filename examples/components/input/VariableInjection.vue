<template>
  
    <div class="qa-input-textarea-variable-injection">
      <preview-group>
        <preview name="Default" span="8" align-items="stretch">
          <el-input
            id="variableInjection"
            ref="variableInjection"
            v-model="textarea"
            label="Label"
            type="textarea"
            class="py-8"
            :freeze-focus="freezeFocus"
          />
          <div class="el-text el-text--body-24 py-8">The following variables can be used:</div>
          <template
            v-for="name in variableList"
            :key="name"
          >
            <el-link
              id="variable-injection"
              class="el-text el-text--body-24"
              @click="handleClick(name)"
            >
              {{ name }}
            </el-link>
          </template>
        </preview>
      </preview-group>
    </div>
  
</template>

<script setup>
import { ref } from 'vue';

import ElInput from 'packages/input';
import ElLink from 'packages/link';

import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const textarea = ref('');
const variableInjection = ref(null);
const freezeFocus = ref(false);
const variableList = ref(['[Disk name]', '[Plan name]', '[Workload name]', '[Monitor name]', '[Customer name]']);

const handleClick = (name) => {
  variableInjection.value.injectText(name);
}
</script>
