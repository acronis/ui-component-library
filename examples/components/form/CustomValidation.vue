<template>
  
      <preview-group>
        <preview name="default 'debounce-input' trigger" span="12">
          <el-card class="full-width">
            <el-form
              inline-message
              :model="debounceInputForm.model"
              :rules="debounceInputForm.rules"
              ref="debounceInputFormRef"
              @submit="submitDebounceInputForm">
              <el-form-item prop="pwd1" class="mx-24 mt-24">
                <el-input v-model="debounceInputForm.model.pwd1" label="Password"></el-input>
              </el-form-item>
              <el-form-item prop="pwd2" class="mx-24">
                <el-input v-model="debounceInputForm.model.pwd2" label="Confirm password"></el-input>
              </el-form-item>
              <div class="form-actions mx-24 mb-24">
                <el-button @click="resetDebounceInputForm" type="secondary">Reset</el-button>
                <el-button native-type="submit">Submit</el-button>
              </div>
            </el-form>
          </el-card>
        </preview>
        <preview name="'blur' trigger" span="12">
          <el-card class="full-width">
            <el-form
              :model="blurInputForm.model"
              :rules="blurInputForm.rules"
              ref="blurInputFormRef"
              @submit="submitBlurInputForm" inline-message>
              <el-form-item prop="pwd1" class="mx-24 mt-24">
                <el-input v-model="blurInputForm.model.pwd1" label="Password"></el-input>
              </el-form-item>
              <el-form-item prop="pwd2" class="mx-24">
                <el-input v-model="blurInputForm.model.pwd2" label="Confirm password"></el-input>
              </el-form-item>
              <div class="form-actions mx-24 mb-24">
                <el-button @click="resetBlurInputForm" type="secondary">Reset</el-button>
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

const validatePassword1 = (_, value, callback) => {
  if (!value) {
    callback(new Error('Please input the password'));
  } else {
    callback();
  }
};

const validatePassword2 = (value, callback, matchValue) => {
  if (!value) {
    callback(new Error('Please input the password again'));
  } else if (value !== matchValue) {
    callback(new Error('Passwords don\'t match!'));
  } else {
    callback();
  }
};


const debounceInputFormRef = ref(null);
const debounceInputForm = reactive({
  model: {
    pwd1: '',
    pwd2: '',
  },
  rules: {
    pwd1: [
      { validator: validatePassword1 }
    ],
    pwd2: [
      {
        validator: (_, value, callback) => validatePassword2(
          value,
          callback,
          debounceInputForm.model.pwd1
        )
      }
    ],
  },
  status: {}
});

const isValid = (valid) => {
  if (valid) {
    alert('submit!');
  } else {
    console.log('error submit!!', valid);
    return false;
  }
}

const submitDebounceInputForm = () => {
  debounceInputFormRef.value.validate(isValid);
};

const resetDebounceInputForm = () => debounceInputFormRef.value.resetFields();

// blur form

const blurInputFormRef = ref(null);
const blurInputForm = reactive({
  model: {
    pwd1: '',
    pwd2: '',
  },
  rules: {
    pwd1: [
      { validator: validatePassword1, trigger: 'blur' }
    ],
    pwd2: [
      {
        trigger: 'blur',
        validator: (_, value, callback) => validatePassword2(
          value,
          callback,
          blurInputForm.model.pwd1
        )
      }
    ]
  },
  status: {}
});

const submitBlurInputForm = () => {
  blurInputFormRef.value.validate(isValid);
};

const resetBlurInputForm = () => blurInputFormRef.value.resetFields();
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