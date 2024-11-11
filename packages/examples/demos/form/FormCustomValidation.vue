<script setup>
  import AcvCard from '@/components/card/card.vue';

  import AcvForm from '@/components/form/form.vue';

  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvInput from '@/components/input/input.vue';

  import { reactive, ref } from 'vue';

  function validatePassword1(_, value, callback) {
    if (!value) {
      callback(new Error('Please input the password'));
    }
    else {
      callback();
    }
  }

  function validatePassword2(value, callback, matchValue) {
    if (!value) {
      callback(new Error('Please input the password again'));
    }
    else if (value !== matchValue) {
      callback(new Error('Passwords don\'t match!'));
    }
    else {
      callback();
    }
  }

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

  function isValid(valid) {
    if (valid) {
      // eslint-disable-next-line no-alert
      alert('submit!');
    }
    else {
      console.log('error submit!!', valid);
      return false;
    }
  }

  function submitDebounceInputForm() {
    debounceInputFormRef.value.validate(isValid);
  }

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

  function submitBlurInputForm() {
    blurInputFormRef.value.validate(isValid);
  }

  const resetBlurInputForm = () => blurInputFormRef.value.resetFields();
</script>

<template>
  <PreviewGroup>
    <Preview
      name="default 'debounce-input' trigger"
      span="12"
    >
      <AcvCard class="full-width">
        <AcvForm
          ref="debounceInputFormRef"
          inline-message
          :model="debounceInputForm.model"
          :rules="debounceInputForm.rules"
          @submit="submitDebounceInputForm"
        >
          <AcvFormItem
            prop="pwd1"
            class="mx-24 mt-24"
          >
            <AcvInput
              v-model="debounceInputForm.model.pwd1"
              label="Password"
            />
          </AcvFormItem>
          <AcvFormItem
            prop="pwd2"
            class="mx-24"
          >
            <AcvInput
              v-model="debounceInputForm.model.pwd2"
              label="Confirm password"
            />
          </AcvFormItem>
          <div class="form-actions mx-24 mb-24">
            <AcvButton
              type="secondary"
              @click="resetDebounceInputForm"
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
      name="'blur' trigger"
      span="12"
    >
      <AcvCard class="full-width">
        <AcvForm
          ref="blurInputFormRef"
          :model="blurInputForm.model"
          :rules="blurInputForm.rules"
          inline-message
          @submit="submitBlurInputForm"
        >
          <AcvFormItem
            prop="pwd1"
            class="mx-24 mt-24"
          >
            <AcvInput
              v-model="blurInputForm.model.pwd1"
              label="Password"
            />
          </AcvFormItem>
          <AcvFormItem
            prop="pwd2"
            class="mx-24"
          >
            <AcvInput
              v-model="blurInputForm.model.pwd2"
              label="Confirm password"
            />
          </AcvFormItem>
          <div class="form-actions mx-24 mb-24">
            <AcvButton
              type="secondary"
              @click="resetBlurInputForm"
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
