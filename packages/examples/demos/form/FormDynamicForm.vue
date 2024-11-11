<script setup>
  import AcvButton from '@/components/button/button.vue';

  import { computed, nextTick, reactive, ref } from 'vue';

  function toObj(arr, key) {
    return arr.reduce((acc, cur, i) => {
      acc[`${key}${i}`] = cur;
      return acc;
    }, {});
  }

  const inputs = ref(['Input0', 'test', '']);
  const status = reactive({});
  const dynamicForm = ref(null);

  const model = computed(() => {
    return toObj(inputs.value, 'item');
  });

  const rules = computed(() => {
    return toObj(
      Array.from(inputs.value).map(() => [
        { required: true },
        { min: 5, max: 32, message: 'Your name should be 5 to 32 length' }
      ]),
      'item'
    );
  });

  function submitForm({ name, value }) {
    status[name] = value;
  }

  function validateForm() {
    nextTick(() => {
      dynamicForm.value.validate().catch(() => console.log('Validation failed'));
    });
  }

  function addItem() {
    inputs.value.push('');
    validateForm();
  }
  function deleteItem() {
    if (inputs.value.length === 1)
      return;
    inputs.value.pop();
    validateForm();
  }
</script>

<template>
  <PreviewGroup>
    <Preview
      span="12"
      name="Dynamic Form Items"
    >
      <acv-card class="full-width px-24 py-24">
        <acv-form
          ref="dynamicForm"
          :model="model"
          :rules="rules"
          @status="submitForm"
        >
          <acv-form-item
            v-for="(_, index) in inputs"
            :key="index"
            :prop="`item${index}`"
          >
            <acv-input
              v-model="inputs[index]"
              :label="`Item${index}`"
            />
          </acv-form-item>
          <div class="form-actions">
            <AcvButton
              type="secondary"
              @click="addItem"
            >
              +
            </AcvButton>
            <AcvButton
              type="secondary"
              @click="deleteItem"
            >
              -
            </AcvButton>
            <AcvButton
              native-type="submit"
              :disabled="status.invalid"
            >
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
