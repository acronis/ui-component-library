<script setup>
  import { reactive, ref } from 'vue';

  const multipleErrorDemoForm = ref(null);

  const model = reactive({
    email: ''
  });

  const rules = reactive({
    email: {
      validator: (_, value, callback) => {
        const errors = [];
        if (!/^[\w.!#$%&’*+/=?^`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/i.test(value)) {
          errors.push('Incorrect email address format. Please use a valid email address. Without specifying email you will not be able to register');
        }
        if (value.length > 10) {
          errors.push('email is too long');
        }

        callback(errors);
      }
    }
  });

  function submitForm() {
    multipleErrorDemoForm.value.validate((valid) => {
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
  function resetForm() {
    multipleErrorDemoForm.value.resetFields();
  }
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Multiple error"
      span="12"
    >
      <acv-card class="full-width px-24 py-24">
        <acv-form
          ref="multipleErrorDemoForm"
          :model="model"
          :rules="rules"
          @submit="submitForm"
        >
          <acv-form-item prop="email">
            <acv-input
              :model-value="model.email"
              label="Email"
            />
          </acv-form-item>
          <div class="form-actions">
            <AcvButton
              type="secondary"
              @click="resetForm"
            >
              Reset
            </AcvButton>
            <AcvButton native-type="submit">
              Submit
            </AcvButton>
          </div>
        </acv-form>
      </acv-card>
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
