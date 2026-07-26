<script setup>
  import AcvDivider from '@/components/divider/divider.vue';

  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvInput from '@/components/input/input.vue';

  import { reactive, ref } from 'vue';

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
          pattern: /^[\w.!#$%&’*+/=?^`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/i,
          message: 'Incorrect email address format. Please use a valid email address. Without specifying email you will not be able to register',
          trigger: 'blur'
        }
      ],
      password: [
        { required: true, message: 'Please input password' }
      ]
    }
  });

  function submitInlineErrorForm() {
    inlineErrorFormRef.value.validate((valid) => {
      if (valid) {
        // eslint-disable-next-line no-alert
        alert('submit!');
      }
      else {
        console.log('error submit!!', valid);
        return false;
      }
    });
  }

  const serverErrorFormRef = ref(null);
  const serverErrorForm = reactive({
    model: {
      email: '',
      password: ''
    },
    errors: []
  });

  function submitServerErrorForm() {
    serverErrorForm.errors = ['E-mail is already in use. Choose another email', 'Password too short'];
  }

  function resetServerErrorForm() {
    serverErrorFormRef.value.resetFields();
    serverErrorForm.errors = [];
  }
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Default (inline message)"
      span="12"
    >
      <AcvCard class="full-width px-24 py-24">
        <AcvForm
          ref="inlineErrorFormRef"
          :model="inlineErrorForm.model"
          :rules="inlineErrorForm.rules"
          @submit="submitInlineErrorForm"
        >
          <AcvFormItem prop="email">
            <AcvInput
              v-model="inlineErrorForm.model.email"
              label="Email"
            />
          </AcvFormItem>
          <AcvFormItem prop="password">
            <AcvPassword
              v-model="inlineErrorForm.model.password"
              label="Password"
              with-icon
            />
          </AcvFormItem>
          <div class="form-actions">
            <AcvButton
              type="secondary"
              @click="() => inlineErrorFormRef.resetFields()"
            >
              Reset
            </AcvButton>
            <AcvButton native-type="submit">
              Submit
            </AcvButton>
          </div>
        </AcvForm>
      </AcvCard>
    </Preview>
    <Preview
      name="Server error"
      span="12"
    >
      <AcvCard class="full-width">
        <AcvForm
          ref="serverErrorFormRef"
          :model="serverErrorForm.model"
          @submit="submitServerErrorForm"
        >
          <AcvFormItem
            prop="email"
            class="mx-24 mt-24"
          >
            <AcvInput
              v-model="serverErrorForm.model.email"
              label="Email"
            />
          </AcvFormItem>
          <AcvFormItem
            prop="password"
            class="mx-24"
          >
            <AcvPassword
              v-model="serverErrorForm.model.password"
              label="Password"
              with-icon
            />
          </AcvFormItem>
          <template v-if="serverErrorForm.errors.length > 0">
            <AcvDivider />
            <AcvFormError
              v-for="error in serverErrorForm.errors"
              :key="error"
              size="large"
              show-icon
              class="mx-24 my-8"
            >
              {{ error }}
            </AcvFormError>
            <AcvDivider class="mb-24" />
          </template>
          <div class="form-actions mx-24 mb-24">
            <AcvButton
              type="secondary"
              @click="resetServerErrorForm"
            >
              Reset
            </AcvButton>
            <AcvButton native-type="submit">
              Submit
            </AcvButton>
          </div>
        </AcvForm>
      </AcvCard>
    </Preview>
  </PreviewGroup>
</template>

<style scoped>
  .full-width {
    width: 100%;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
</style>
