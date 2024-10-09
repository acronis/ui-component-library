<script setup>
  import AcvDialog from '@/components/dialog/dialog.vue';

  import AcvForm from '@/components/form/form.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvInput from '@/components/input/input.vue';
  import { reactive, ref } from 'vue';

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
  function loginSubmit(e) {
    console.log('submit', e);
    loginForm.error = '';
    if (e.username && e.username === 'return_error') {
      const setErrorMessage = () => loginForm.error = 'Server error';
      setTimeout(setErrorMessage, 300);
    }
  }
  function clearError() {
    loginForm.error = '';
  }
</script>

<template>
  <Preview
    name="Login"
    span="8"
  >
    <AcvButton @click="loginDialogVisible = true">
      Login form
    </AcvButton>
    <AcvForm
      :model="loginForm"
      :rules="loginFormRules"
      @submit="loginSubmit"
    >
      <AcvDialog
        v-model:visible="loginDialogVisible"
        title="Autotask integrations"
      >
        <div class="acv-text acv-text--body-24 mx-24 my-16">
          Please provide username and password that is necessary to access AutoTask PSA API
        </div>
        <AcvFormItem
          class="mx-24 mt-16"
          prop="username"
          :error="loginForm.error"
          @input="clearError"
        >
          <AcvInput
            v-model="loginForm.username"
            label="Username"
          />
        </AcvFormItem>
        <AcvFormItem
          class="mx-24"
          prop="password"
        >
          <AcvInput
            v-model="loginForm.password"
            label="Password"
            type="password"
          />
        </AcvFormItem>
        <template #footer>
          <AcvButton
            type="secondary"
            native-type="button"
            @click="loginDialogVisible = false"
          >
            Cancel
          </AcvButton>
          <AcvButton native-type="submit">
            Log in
          </AcvButton>
        </template>
      </AcvDialog>
    </AcvForm>
  </Preview>
</template>
