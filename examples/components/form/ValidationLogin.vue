<template>
  <preview name="Login" span="8">
    <el-button @click="loginDialogVisible = true">Login form</el-button>
    <el-form :model="loginForm" @submit="loginSubmit" :rules="loginFormRules">
      <el-dialog v-model:visible="loginDialogVisible" title="Autotask integrations">
        <div class="el-text el-text--body-24 mx-24 my-16">Please provide username and password that is necessary to access AutoTask PSA API</div>
        <el-form-item class="mx-24 mt-16" prop="username" :error="loginForm.error" @input="clearError">
          <el-input v-model="loginForm.username" label="Username" />
        </el-form-item>
        <el-form-item class="mx-24" prop="password">
          <el-input v-model="loginForm.password" label="Password" type="password" />
        </el-form-item>
        <template v-slot:footer>
          <el-button type="secondary" native-type="button" @click="loginDialogVisible = false">Cancel</el-button>
          <el-button native-type="submit">Log in</el-button>
        </template>
      </el-dialog>
    </el-form>
  </preview>
</template>
<script setup>
import { ref, reactive } from 'vue';
import Preview from 'examples/components/preview.vue';
import ElButton from 'packages/button';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import ElDialog from 'packages/dialog';

const loginDialogVisible = ref(false);
const loginForm = reactive({
  username: '',
  password: '',
  error: ''
});
const loginFormRules = reactive({
  username: [
    { required: true, trigger: 'submit' },
    { min: 6, message: 'Username must be at least 6 letters', trigger: 'blur debounce-input' }
  ],
  password: [
    { required: true, trigger: 'submit' },
    { min: 8, message: 'Password must be at least 8 letters', trigger: 'blur debounce-input' }
  ]
});
const loginSubmit = (e) => {
  console.log('submit', e);
  loginForm.error = "";
  if (e.username && e.username === 'return_error') {
    const setErrorMessage = () => loginForm.error = "Server error";
    setTimeout(setErrorMessage, 300);
  }
};
const clearError = () =>{
  loginForm.error = '';
}
</script>