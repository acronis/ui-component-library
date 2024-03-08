<template>
  
      <div class="qa-input-slot">
        <preview-group>
          <preview name="Prefix slot" span="12" align-items="stretch">
            <el-input
              v-model="prefix"
              label="Label"
            >
              <template #prefix>
                <el-select
                  v-model="selectPrefix"
                  label="Label">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </preview>
          <preview name="Suffix slot" span="12" align-items="stretch">
            <el-input
              v-model="suffix"
              label="Label"
            >
              <template #suffix>
                <el-select
                  v-model="selectSuffix"
                  label="Label">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </preview>
        </preview-group>
      </div>
    
</template>
<script setup>
import { ref } from 'vue';

import ElInput from 'packages/input';
import ElSelect from 'packages/select';
import ElOption from 'packages/option';

import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const prefix = ref('');
const suffix = ref('');
const selectPrefix = ref('');
const selectSuffix = ref('');
const options = ref([
  {
    label: 'Not defined',
    value: '1'
  },{
    label: 'Approved',
    value: '2'
  },{
    label: 'Declined',
    value: '3'
  }
]);

</script>