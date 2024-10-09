<script setup>
  import AcvDialog from '@/components/dialog/dialog.vue';

  import AcvDivider from '@/components/divider/divider.vue';
  import AcvForm from '@/components/form/form.vue';
  import AcvFormError from '@/components/form-error/formError.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvInput from '@/components/input/input.vue';
  import { computed, reactive, ref } from 'vue';

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
        pattern: /^[\w.!#$%&’*+/=?^`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/i,
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
    const email = registrationFormServerErrors.includes('E-mail is already in use. Choose another email');
    const password1 = registrationFormServerErrors.includes('Passwords do not match');
    const password2 = password1;
    return { name, email, password1, password2 };
  });
  const registrationFormStatus = reactive({});
  function onRegistrationFormStatus({ name, value }) {
    registrationFormStatus.name = name;
    registrationFormStatus.value = value;
  }
  const registrationFormSubmitting = ref(false);
  function submitRegistrationForm(e) {
    registrationFormItem.value.validate((valid) => {
      if (valid) {
        console.log(e);
        registrationDialogVisible.value = false;
        registrationFormServerErrors.values = [];
      }
      else {
        console.log('error submit', valid);
        return false;
      }
    });
  }
  function submitRegistrationFormServer1() {
    registrationFormItem.value.validate((valid) => {
      if (valid) {
        registrationFormSubmitting.value = true;
        registrationFormServerErrors.splice(0, registrationFormServerErrors.length);
        setTimeout(() => {
          registrationFormServerErrors.push('E-mail is already in use. Choose another email');
          if (registrationForm.password1 !== registrationForm.password2) {
            registrationFormServerErrors.push('Passwords do not match');
          }
          registrationFormSubmitting.value = false;
        }, 1000);
      }
      else {
        console.log('error submit', valid);
        return false;
      }
    });
  }
</script>

<template>
  <Preview
    name="Registration"
    span="8"
  >
    <AcvButton @click="registrationDialogVisible = true">
      Registration form
    </AcvButton>
    <AcvForm
      ref="registrationFormItem"
      :model="registrationForm"
      :rules="registrationFormRules"
      @submit="submitRegistrationForm"
      @status="onRegistrationFormStatus"
    >
      <AcvDialog
        v-model:visible="registrationDialogVisible"
        title="Registration"
      >
        <AcvFormItem
          class="mx-24 mt-24"
          prop="name"
          :error="registrationFormErrorState.name"
        >
          <AcvInput
            v-model="registrationForm.name"
            label="Name"
          />
        </AcvFormItem>
        <AcvFormItem
          class="mx-24"
          prop="email"
          :error="registrationFormErrorState.email"
        >
          <AcvInput
            v-model="registrationForm.email"
            label="Email"
            native-type="email"
          />
        </AcvFormItem>
        <AcvDivider />
        <AcvFormItem
          class="mx-24 mt-24"
          prop="password1"
          :error="registrationFormErrorState.password1"
        >
          <AcvInput
            v-model="registrationForm.password1"
            label="Password"
            type="password"
          />
        </AcvFormItem>
        <AcvFormItem
          class="mx-24"
          prop="password2"
          :error="registrationFormErrorState.password2"
        >
          <AcvInput
            v-model="registrationForm.password2"
            label="Confirm password"
            type="password"
          />
        </AcvFormItem>
        <template v-if="registrationFormServerErrors.length > 0">
          <AcvDivider />
          <AcvFormError
            v-for="error in registrationFormServerErrors"
            :key="error"
            show-icon
            size="large"
            class="mx-24 my-8"
          >
            {{ error }}
          </AcvFormError>
        </template>
        <template #footer>
          <AcvButton
            type="secondary"
            native-type="button"
            @click="registrationDialogVisible = false"
          >
            Cancel
          </AcvButton>
          <AcvButton
            native-type="submit"
            :disabled="registrationFormStatus.invalid"
          >
            Register
          </AcvButton>
          <AcvButton
            :loading="registrationFormSubmitting"
            @click="submitRegistrationFormServer1"
          >
            Server Error Demo
          </AcvButton>
        </template>
      </AcvDialog>
    </AcvForm>
  </Preview>
</template>
