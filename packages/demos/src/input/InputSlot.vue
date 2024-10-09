<script setup>
  import AcvInput from '@/components/input/input.vue';

  import AcvOption from '@/components/option/option.vue';
  import AcvSelect from '@/components/select/select.vue';
  import { ref } from 'vue';

  const prefix = ref('');
  const suffix = ref('');
  const selectPrefix = ref('');
  const selectSuffix = ref('');
  const options = ref([
    {
      label: 'Not defined',
      value: '1'
    },
    {
      label: 'Approved',
      value: '2'
    },
    {
      label: 'Declined',
      value: '3'
    }
  ]);
</script>

<template>
  <div class="qa-input-slot">
    <PreviewGroup>
      <Preview
        name="Prefix slot"
        span="12"
        align-items="stretch"
      >
        <AcvInput
          v-model="prefix"
          label="Label"
        >
          <template #prefix>
            <AcvSelect
              v-model="selectPrefix"
              label="Label"
            >
              <AcvOption
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </AcvSelect>
          </template>
        </AcvInput>
      </Preview>
      <Preview
        name="Suffix slot"
        span="12"
        align-items="stretch"
      >
        <AcvInput
          v-model="suffix"
          label="Label"
        >
          <template #suffix>
            <AcvSelect
              v-model="selectSuffix"
              label="Label"
            >
              <AcvOption
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </AcvSelect>
          </template>
        </AcvInput>
      </Preview>
    </PreviewGroup>
  </div>
</template>
