<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvCard from '@/components/card/card.vue';
  import AcvCol from '@/components/column/column.vue';
  import AcvForm from '@/components/form/form.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvInput from '@/components/input/input.vue';
  import AcvRow from '@/components/row/row.vue';
  import { ref } from 'vue';

  const nestedItemValidationForm = ref(null);
  const model = ref({
    list: [
      { name: '', url: 'http://' },
      { name: '', url: 'http://' }
    ]
  });
  const rules = ref({
    list: {
      type: 'array',
      defaultField: {
        type: 'object',
        fields: {
          name: { type: 'string', required: true, message: 'invalid name' },
          url: { type: 'url', required: true, message: 'invalid url' }
        }
      }
    }
  });

  const resetForm = () => nestedItemValidationForm.value.resetFields();
</script>

<template>
  <PreviewGroup>
    <Preview span="24">
      <AcvCard class="full-width px-24 py-24">
        <AcvForm
          ref="nestedItemValidationForm"
          :model="model"
          :rules="rules"
        >
          <AcvFormItem>
            <AcvRow
              v-for="(item, index) in model.list"
              :key="index"
              :gutter="16"
            >
              <AcvCol :span="12">
                <AcvFormItem :prop="`list.${index}.name`">
                  <AcvInput
                    v-model="item.name"
                    label="Name"
                  />
                </AcvFormItem>
              </AcvCol>
              <AcvCol :span="12">
                <AcvFormItem :prop="`list.${index}.url`">
                  <AcvInput
                    v-model="item.url"
                    label="URL"
                  />
                </AcvFormItem>
              </AcvCol>
            </AcvRow>
          </AcvFormItem>

          <div class="form-actions">
            <AcvButton
              type="secondary"
              @click="resetForm('nestedItemValidation')"
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
