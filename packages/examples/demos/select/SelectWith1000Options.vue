<script>
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';

  import AcvFormLabel from '@/components/form-label/formLabel.vue';
  import AcvSelect from '@/components/select/select.vue';
  import { generateLargeOptions, treeDataGen } from '../../__mocks__/data.select.generateOptions.js';

  export default {
    components: {
      AcvSelect,
      AcvCheckbox,
      AcvFormLabel
    },
    data() {
      return {
        large: {
          default: generateLargeOptions()(),
          defaultFilled: generateLargeOptions()('Option 1')
        },
        largeSearch: {
          default: generateLargeOptions()(),
          defaultFilled: generateLargeOptions()('Option 1')
        },
        largeMultiple: {
          default: generateLargeOptions()([]),
          checkbox: generateLargeOptions()([]),
          withTree: {
            value: [],
            data: treeDataGen(2, 3)
          }
        },
        largeFlyweight: {
          default: generateLargeOptions()(),
          defaultFilled: generateLargeOptions()('Option 1')
        },
        showDefault: false,
        showSearch: false,
        showMultiple: false,
        showFlyweight: false
      };
    },
  };
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-2">
    <div>
      <AcvFormLabel label="Label">
        <AcvSelect
          v-if="showDefault"
          v-model="large.default.value"
          :options="large.default.options"
        />
      </AcvFormLabel>

      <div class="mt-16">
        <AcvCheckbox v-model="showDefault">
          Default
        </AcvCheckbox>
      </div>
    </div>
    <div>
      <AcvFormLabel label="Label">
        <AcvSelect
          v-if="showSearch"
          v-model="largeSearch.defaultFilled.value"
          :options="largeSearch.defaultFilled.options"
          filterable
        />
      </AcvFormLabel>
      <div class="mt-16">
        <AcvCheckbox v-model="showSearch">
          Search
        </AcvCheckbox>
      </div>
    </div>
    <div>
      <AcvFormLabel label="Label">
        <AcvSelect
          v-if="showMultiple"
          v-model="largeMultiple.checkbox.value"
          :options="largeMultiple.checkbox.options"
          multiple
        />
      </AcvFormLabel>
      <div class="mt-16">
        <AcvCheckbox v-model="showMultiple">
          Multiple
        </AcvCheckbox>
      </div>
    </div>
    <div>
      <AcvFormLabel label="Label">
        <AcvSelect
          v-if="showFlyweight"
          v-model="largeFlyweight.defaultFilled.value"
          :options="largeFlyweight.defaultFilled.options"
          filterable
          flyweight
        />
      </AcvFormLabel>
      <div class="mt-16">
        <AcvCheckbox v-model="showFlyweight">
          Flyweight
        </AcvCheckbox>
      </div>
    </div>
  </div>
</template>
