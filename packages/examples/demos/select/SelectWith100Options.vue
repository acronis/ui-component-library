<script>
  import AcvSelect from '@/components/select/select.vue';
  import { generateMediumOptions, treeDataGen } from '../../__mocks__/data.select.generateOptions.js';

  export default {
    components: {
      AcvSelect
    },
    data() {
      return {
        medium: {
          default: generateMediumOptions()(),
          defaultFilled: generateMediumOptions()('Option 1')
        },
        mediumSearch: {
          default: generateMediumOptions()(),
          defaultFilled: generateMediumOptions()('Option 1')
        },
        mediumMultiple: {
          default: generateMediumOptions()([]),
          checkbox: generateMediumOptions()([]),
          withTree: {
            value: [],
            data: treeDataGen(2, 3)
          }
        }
      };
    }
  };
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-2">
    <div>
      <AcvSelect
        v-model="medium.default.value"
        label="Label"
        :options="medium.default.options"
      />
    </div>
    <div>
      <AcvSelect
        v-model="mediumSearch.default.value"
        filterable
        label="Label"
        :options="mediumSearch.default.options"
      />
    </div>
    <div>
      <AcvSelect
        v-model="mediumMultiple.checkbox.value"
        multiple
        label="Label"
        :options="mediumMultiple.checkbox.options"
      />
    </div>
  </div>
</template>
