<script setup>
  import AcvFormItem from '@/components/form-item/formItem.vue';

  import AcvInput from '@/components/input/input.vue';
  import { ref } from 'vue';

  const manualValidationForm = ref(null);
  const model = ref({
    name: '',
    age: '',
    status: ''
  });

  const errors = ref({
    name: '',
    age: '',
    status: ''
  });

  function submitManualValidation() {
    let ageMsg = 'Please input digits';
    let statusMsg = 'error';
    const { age } = model.value;
    if (!Number.isInteger(age)) {
      ageMsg = 'Please input digits';
    }
    else {
      if (age < 18) {
        ageMsg = 'Age must be greater than 18';
      }
      else {
        ageMsg = '';
        statusMsg = '';
      }
    }
    errors.value = {
      name: '',
      age: ageMsg,
      status: statusMsg
    };
  }
  const resetForm = () => manualValidationForm.value.resetFields();
</script>

<template>
  <PreviewGroup>
    <Preview span="12">
      <acv-card class="full-width px-24 py-24">
        <acv-form
          ref="manualValidationForm"
          :model="model"
          @submit="submitManualValidation"
        >
          <AcvFormItem
            prop="name"
            error="Name is invalid"
          >
            <AcvInput
              v-model="model.name"
              label="Name"
            />
          </AcvFormItem>
          <AcvFormItem
            prop="age"
            :error="errors.age"
          >
            <AcvInput
              v-model.number="model.age"
              label="Age"
            />
          </AcvFormItem>
          <AcvFormItem
            prop="status"
            :error="!!errors.status"
          >
            <AcvInput
              v-model.number="model.status"
              label="Status"
            />
          </AcvFormItem>
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
