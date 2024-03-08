<template>
  <preview name="Registration" span="8">
    <el-button @click="registrationDialogVisible = true">Registration form</el-button>
    <el-form :model="registrationForm" :rules="registrationFormRules" ref="registrationFormItem" @submit="submitRegistrationForm" @status="onRegistrationFormStatus">
      <el-dialog v-model:visible="registrationDialogVisible" title="Registration">
        <el-form-item class="mx-24 mt-24" prop="name" :error="registrationFormErrorState.name">
          <el-input v-model="registrationForm.name" label="Name"/>
        </el-form-item>
        <el-form-item class="mx-24" prop="email" :error="registrationFormErrorState.email">
          <el-input v-model="registrationForm.email" label="Email" native-type="email"/>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item class="mx-24 mt-24" prop="password1" :error="registrationFormErrorState.password1">
          <el-input v-model="registrationForm.password1" label="Password" type="password" />
        </el-form-item>
        <el-form-item class="mx-24" prop="password2" :error="registrationFormErrorState.password2">
          <el-input v-model="registrationForm.password2" label="Confirm password" type="password" />
        </el-form-item>
        <template v-if="registrationFormServerErrors.length > 0">
          <el-divider></el-divider>
          <el-form-error show-icon size="large" class="mx-24 my-8" v-for="error in registrationFormServerErrors" :key="error">{{ error }}</el-form-error>
        </template>
        <template v-slot:footer>
          <el-button type="secondary" native-type="button" @click="registrationDialogVisible = false">Cancel</el-button>
          <el-button native-type="submit" :disabled="registrationFormStatus.invalid">Register</el-button>
          <el-button @click="submitRegistrationFormServer1" :loading="registrationFormSubmitting">Server Error Demo</el-button>
        </template>
      </el-dialog>
    </el-form>
  </preview>
</template>
<script setup>
import { ref, reactive, computed } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElDivider from 'packages/divider';
import ElForm from 'packages/form';
import ElFormError from 'packages/form-error';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElDialog from 'packages/dialog';

const registrationDialogVisible = ref(false);
const registrationFormItem = ref(null);
const registrationForm = reactive({
  name: '',
  email: '',
  password1: '',
  password2: ''
});
const registrationFormRules = reactive({
  name: [
    { required: true, message: 'Please input name', trigger: 'submit' },
    { min: 3, message: 'The name must container at least 3 letters', trigger: 'blur debounce-input' }
  ],
  email: [
    { required: true, message: 'Please input email', trigger: 'submit' },
    {
      pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      message: 'Incorrect email address format. Please use a valid email address. Without specifying email you will not be able to register',
      trigger: 'blur'
    }
  ],
  password1: [
    { required: true, message: 'Please input password', trigger: 'submit' }
  ],
  password2: [
    { required: true, message: 'Please input confirm password', trigger: 'submit' }
  ]
});

const registrationFormServerErrors = reactive([]);
const registrationFormErrorState = computed(() => {
  const name = false;
  const email = registrationFormServerErrors.indexOf('E-mail is already in use. Choose another email') !== -1;
  const password1 = registrationFormServerErrors.indexOf('Passwords do not match') !== -1;
  const password2 = password1;
  return { name, email, password1, password2 };
});
const registrationFormStatus = reactive({});
const onRegistrationFormStatus = ({ name, value}) => {
  registrationFormStatus.name = name;
  registrationFormStatus.value = value;
};
const registrationFormSubmitting = ref(false);
const submitRegistrationForm = (e) =>{
  registrationFormItem.value.validate((valid) => {
    if (valid) {
      console.log(e);
      registrationDialogVisible.value = false;
      registrationFormServerErrors.values = [];
    } else {
      console.log('error submit', valid);
      return false;
    }
  })
};
const submitRegistrationFormServer1 = () => {
  registrationFormItem.value.validate((valid) => {
    if (valid) {
      registrationFormSubmitting.value = true;
      registrationFormServerErrors.splice(0, registrationFormServerErrors.length)
      setTimeout(() => {
        registrationFormServerErrors.push('E-mail is already in use. Choose another email')
        if (registrationForm.password1 !== registrationForm.password2) {
          registrationFormServerErrors.push('Passwords do not match');
        }
        registrationFormSubmitting.value = false;
      }, 1000);
    } else {
      console.log('error submit', valid);
      return false;
    }
  })
};
</script>