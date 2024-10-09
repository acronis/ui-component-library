<script setup>
  import AcvCard from '@/components/card/card.vue';

  import AcvForm from '@/components/form/form.vue';

  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvInput from '@/components/input/input.vue';
  import AcvOption from '@/components/option/option.vue';
  import AcvSelect from '@/components/select/select.vue';

  import { reactive, ref } from 'vue';

  const defaultForm = reactive({
    model: {
      name: ''
    },
    rules: {
      name: [
        { required: true },
        { min: 6, max: 32, message: 'Your name should be 6 to 32 length' }
      ]
    },
    status: {}
  });
  const defaultFormRef = ref(null);

  function updateDefaultFormStatus({ name, value }) {
    defaultForm.status[name] = value;
  }

  const resetDefaultForm = () => defaultFormRef.value.resetFields();

  const submitForm = reactive({
    model: {
      name: ''
    },
    rules: {
      name: [
        { required: true, trigger: 'submit' },
        { min: 6, max: 32, message: 'Your name should be 6 to 32 length', trigger: 'submit' }
      ]
    },
    status: {}
  });
  const submitFormRef = ref(null);

  function updateSubmitFormStatus({ name, value }) {
    submitForm.status[name] = value;
  }

  const resetSubmitForm = () => submitFormRef.value.resetFields();

  const blurFormRef = ref(null);
  const blurForm = reactive({
    model: {},
    rules: {
      name: [
        { required: true, trigger: 'blur' },
        { min: 6, max: 32, message: 'Your name should be 6 to 32 length', trigger: 'blur' }
      ]
    },
    status: {}
  });

  const updateBlurFormRefStatus = ({ name, value }) => blurForm.status[name] = value;

  const resetBlurForm = () => blurFormRef.value.resetFields();

  const debouncedInputFormRef = ref(null);
  const debouncedInputForm = reactive({
    model: {},
    rules: {
      name: [
        { required: true, trigger: 'debounce-input' },
        { min: 6, max: 32, message: 'Your name should be 6 to 32 length', trigger: 'debounce-input' }
      ]
    },
    status: {}
  });

  const updateDebouncedInputFormRefStatus = ({ name, value }) => debouncedInputForm.status[name] = value;

  const resetDebouncedInputForm = () => debouncedInputFormRef.value.resetFields();

  const changeSelectFormRef = ref(null);
  const changeSelectForm = reactive({
    model: {},
    rules: {
      name: [
        { required: true, trigger: 'change' }
      ]
    },
    status: {}
  });

  const updateChangeSelectFormRefStatus = ({ name, value }) => changeSelectForm.status[name] = value;

  const resetChangeSelectForm = () => changeSelectFormRef.value.resetFields();

  const changeInputFormRef = ref(null);
  const changeInputForm = reactive({
    model: {},
    rules: {
      name: [
        { required: true, trigger: 'change' },
        { min: 6, max: 32, message: 'Your name should be 6 to 32 length', trigger: 'change' }
      ]
    },
    status: {}
  });

  function updateChangeInputFormRefStatus({ name, value }) {
    changeInputForm.status[name] = value;
  }

  const resetChangeInputForm = () => changeInputFormRef.value.resetFields();
</script>

<template>
  <PreviewGroup>
    <Preview
      span="10"
      name="Default (blur + debouncedInput)"
    >
      <AcvCard class="full-width px-24 py-24">
        <AcvForm
          ref="defaultFormRef"
          :model="defaultForm.model"
          :rules="defaultForm.rules"
          @status="updateDefaultFormStatus"
        >
          <AcvFormItem prop="name">
            <AcvInput
              v-model="defaultForm.model.name"
              label="Name"
            />
          </AcvFormItem>
          <div class="form-actions">
            <AcvButton
              type="secondary"
              @click="resetDefaultForm"
            >
              Reset
            </AcvButton>
            <AcvButton
              native-type="submit"
              :disabled="defaultForm.status.invalid"
            >
              Submit
            </AcvButton>
          </div>
        </AcvForm>
      </AcvCard>
    </Preview>
    <Preview
      span="10"
      name="submit"
    >
      <AcvCard class="full-width px-24 py-24">
        <AcvForm
          ref="submitFormRef"
          :model="submitForm.model"
          :rules="submitForm.rules"
          @status="updateSubmitFormStatus"
        >
          <AcvFormItem prop="name">
            <AcvInput
              v-model="submitForm.model.name"
              label="Name"
            />
          </AcvFormItem>
          <div class="form-actions">
            <AcvButton
              type="secondary"
              @click="resetSubmitForm"
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
      span="10"
      name="blur"
    >
      <AcvCard class="full-width px-24 py-24">
        <AcvForm
          ref="blurFormRef"
          :model="blurForm.model"
          :rules="blurForm.rules"
          @status="updateBlurFormRefStatus"
        >
          <AcvFormItem prop="name">
            <AcvInput
              v-model="blurForm.model.name"
              label="Name"
            />
          </AcvFormItem>
          <div class="form-actions">
            <AcvButton
              type="secondary"
              @click="resetBlurForm"
            >
              Reset
            </AcvButton>
            <AcvButton
              native-type="submit"
              :disabled="blurForm.status.invalid"
            >
              Submit
            </AcvButton>
          </div>
        </AcvForm>
      </AcvCard>
    </Preview>
    <Preview
      span="10"
      name="debounce-input"
    >
      <AcvCard class="full-width px-24 py-24">
        <AcvForm
          ref="debouncedInputFormRef"
          :model="debouncedInputForm.model"
          :rules="debouncedInputForm.rules"
          @status="updateDebouncedInputFormRefStatus"
        >
          <AcvFormItem prop="name">
            <AcvInput
              v-model="debouncedInputForm.model.name"
              label="Name"
            />
          </AcvFormItem>
          <div class="form-actions">
            <AcvButton
              type="secondary"
              @click="resetDebouncedInputForm"
            >
              Reset
            </AcvButton>
            <AcvButton
              native-type="submit"
              :disabled="debouncedInputForm.status.invalid"
            >
              Submit
            </AcvButton>
          </div>
        </AcvForm>
      </AcvCard>
    </Preview>
    <Preview
      span="10"
      name="change - select"
    >
      <AcvCard class="full-width px-24 py-24">
        <AcvForm
          ref="changeSelectFormRef"
          :model="changeSelectForm.model"
          :rules="changeSelectForm.rules"
          @status="updateChangeSelectFormRefStatus"
        >
          <AcvFormItem prop="name">
            <AcvSelect
              v-model="changeSelectForm.model.name"
              label="Name"
              multiple
            >
              <AcvOption
                label="Name 1"
                value="1"
                checkbox
              />
              <AcvOption
                label="Name 2"
                value="2"
                checkbox
              />
            </AcvSelect>
          </AcvFormItem>
          <div class="form-actions">
            <AcvButton
              type="secondary"
              @click="resetChangeSelectForm"
            >
              Reset
            </AcvButton>
            <AcvButton
              native-type="submit"
              :disabled="changeSelectForm.status.invalid"
            >
              Submit
            </AcvButton>
          </div>
        </AcvForm>
      </AcvCard>
    </Preview>
    <Preview
      span="10"
      name="change - input"
    >
      <AcvCard class="full-width px-24 py-24">
        <AcvForm
          ref="changeInputFormRef"
          :model="changeInputForm.model"
          :rules="changeInputForm.rules"
          @status="updateChangeInputFormRefStatus"
        >
          <AcvFormItem prop="name">
            <AcvInput
              v-model="changeInputForm.model.name"
              label="Name"
            />
          </AcvFormItem>
          <div class="form-actions">
            <AcvButton
              type="secondary"
              @click="resetChangeInputForm"
            >
              Reset
            </AcvButton>
            <AcvButton
              native-type="submit"
              :disabled="changeInputForm.status.invalid"
            >
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
