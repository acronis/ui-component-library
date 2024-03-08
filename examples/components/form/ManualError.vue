<template>
  
      <preview-group>
        <preview span="12">
          <el-card class="full-width px-24 py-24">
            <el-form :model="model" ref="manualValidationForm" @submit="submitManualValidation">
              <el-form-item prop="name" error="Name is invalid">
                <el-input v-model="model.name" label="Name"></el-input>
              </el-form-item>
              <el-form-item prop="age" :error="errors.age">
                <el-input v-model.number="model.age" label="Age"></el-input>
              </el-form-item>
              <el-form-item prop="status" :error="!!errors.status">
                <el-input v-model.number="model.status" label="Status"></el-input>
              </el-form-item>
              <div class="form-actions">
                <el-button @click="resetForm" type="secondary">Reset</el-button>
                <el-button native-type="submit">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
      </preview-group>
    
</template>
<script setup>
import { ref } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElCard from 'packages/card';

import PreviewGroup from 'examples/components/preview-group.vue';

const manualValidationForm = ref(null);
const model = ref({
  name: '',
  age: '',
  status: ''
});

const errors = ref({
  name: '',
  age: '',
  status: ''
});

const submitManualValidation = () => {
  let ageMsg = 'Please input digits';
  let statusMsg = 'error';
  const { age } = model.value;
  if (!Number.isInteger(age)) {
    ageMsg = 'Please input digits';
  } else {
    if (age < 18) {
      ageMsg = 'Age must be greater than 18';
    } else {
      ageMsg = '';
      statusMsg = '';
    }
  }
  errors.value = {
    name: '',
    age: ageMsg,
    status: statusMsg
  };
};
const resetForm = () => manualValidationForm.value.resetFields();
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