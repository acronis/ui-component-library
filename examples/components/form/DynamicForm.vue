<template>
  
      <preview-group>
        <preview span="12" name="Dynamic Form Items">
          <el-card class="full-width px-24 py-24">
            <el-form
              :model="model"
              :rules="rules"
              ref="dynamicForm"
              @status="submitForm"
            >
              <el-form-item
                v-for="(_, index) in inputs"
                :key="index"
                :prop="`item${index}`"
              >
                <el-input v-model="inputs[index]" :label="`Item${index}`"></el-input>
              </el-form-item>
              <div class="form-actions">
                <el-button @click="addItem" type="secondary">+</el-button>
                <el-button @click="deleteItem" type="secondary">-</el-button>
                <el-button native-type="submit" :disabled="status.invalid">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
      </preview-group>
    
</template>
<script setup>
import { ref, reactive, computed, nextTick } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElCard from 'packages/card';

import PreviewGroup from 'examples/components/preview-group.vue';

const toObj = (arr, key) => {
  return arr.reduce((acc, cur, i) => {
    acc[`${key}${i}`] = cur;
    return acc;
  }, {})
};

const inputs = ref(['Input0', 'test', '']);
const status = reactive({});
const dynamicForm = ref(null);

const model = computed(() => {
  return toObj(inputs.value, 'item');
});

const rules = computed(() => {
  return toObj(
    Array.from(inputs.value).map(() => [
      { required: true },
      { min: 5, max: 32, message: 'Your name should be 5 to 32 length' }
    ]),
  'item');
});

const submitForm = ({ name, value }) => {
  status[name] = value;
};

const validateForm = () => {
  nextTick(() => {
    dynamicForm.value.validate().catch(() => console.log('Validation failed'));
  });
};

const addItem = () => {
  inputs.value.push('');
  validateForm();
};
const deleteItem = () => {
  if (inputs.value.length === 1) return;
  inputs.value.pop();
  validateForm();
};
</script>
<style lang="scss" scoped>
  .full-width {
    width: 100%;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
