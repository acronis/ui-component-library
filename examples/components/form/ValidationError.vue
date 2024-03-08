<template>
  
      <preview-group>
        <preview name="Default (inline message)" span="12">
          <el-card class="full-width px-24 py-24">
            <el-form
              :model="inlineErrorForm.model"
              :rules="inlineErrorForm.rules"
              ref="inlineErrorFormRef"
              @submit="submitInlineErrorForm"
            >
              <el-form-item prop="email">
                <el-input v-model="inlineErrorForm.model.email" label="Email"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-password v-model="inlineErrorForm.model.password" label="Password" with-icon></el-password>
              </el-form-item>
              <div class="form-actions">
                <el-button
                  type="secondary"
                  @click="() => inlineErrorFormRef.resetFields()"
                >Reset</el-button>
                <el-button native-type="submit">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
        <preview name="Server error" span="12">
          <el-card class="full-width">
            <el-form
              :model="serverErrorForm.model"
              ref="serverErrorFormRef"
              @submit="submitServerErrorForm">
              <el-form-item prop="email" class="mx-24 mt-24">
                <el-input v-model="serverErrorForm.model.email" label="Email"></el-input>
              </el-form-item>
              <el-form-item prop="password" class="mx-24">
                <el-password v-model="serverErrorForm.model.password" label="Password" with-icon></el-password>
              </el-form-item>
              <template v-if="serverErrorForm.errors.length > 0">
                <el-divider></el-divider>
                  <el-form-error
                    size="large"
                    show-icon
                    class="mx-24 my-8"
                    v-for="error in serverErrorForm.errors"
                    :key="error"
                  >{{ error }}</el-form-error>
                <el-divider class="mb-24"></el-divider>
              </template>
              <div class="form-actions mx-24 mb-24">
                <el-button @click="resetServerErrorForm" type="secondary">Reset</el-button>
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
import ElFormError from 'packages/form-error';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElCard from 'packages/card';
import ElPassword from 'packages/password';
import ElDivider from 'packages/divider';

import PreviewGroup from 'examples/components/preview-group.vue';

const inlineErrorFormRef = ref(null);
const inlineErrorForm = reactive({
  model: {
    email: '',
    password: ''
  },
  rules: {
    email: [
      { required: true, message: 'Please input email', trigger: 'blur' },
      {
        pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        message: 'Incorrect email address format. Please use a valid email address. Without specifying email you will not be able to register',
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, message: 'Please input password' }
    ]
  }
});

const submitInlineErrorForm = () => {
  inlineErrorFormRef.value.validate((valid) => {
    if (valid) {
      alert('submit!');
    } else {
      console.log('error submit!!', valid);
      return false;
    }
  });
};

const serverErrorFormRef = ref(null);
const serverErrorForm = reactive({
  model: {
    email: '',
    password: ''
  },
  errors: []
});

const submitServerErrorForm = () => {
  serverErrorForm.errors = ['E-mail is already in use. Choose another email', 'Password too short'];
};

const resetServerErrorForm = () => {
  serverErrorFormRef.value.resetFields();
  serverErrorForm.errors = [];
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