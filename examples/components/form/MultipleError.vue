<template>
  
      <preview-group>
        <preview name="Multiple error" span="12">
          <el-card class="full-width px-24 py-24">
            <el-form
              :model="model"
              :rules="rules"
              ref="multipleErrorDemoForm"
              @submit="submitForm">
              <el-form-item prop="email">
                <el-input :modelValue="model.email" label="Email"></el-input>
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
import { ref, reactive } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElCard from 'packages/card';

import PreviewGroup from 'examples/components/preview-group.vue';

const multipleErrorDemoForm = ref(null);

const model = reactive({
  email: ''
});

const rules = reactive({
  email: {
    validator: (_, value, callback) => {
      const errors = [];
      if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
        errors.push('Incorrect email address format. Please use a valid email address. Without specifying email you will not be able to register');
      }
      if (value.length > 10) {
        errors.push('email is too long');
      }

      callback(errors);
    }
  }
});

const submitForm = () => {
  multipleErrorDemoForm.value.validate((valid) => {
    if (valid) {
      alert('submit!');
    } else {
      console.log('error submit!!', valid);
      return false;
    }
  });
};
const resetForm = () => {
  multipleErrorDemoForm.value.resetFields();
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