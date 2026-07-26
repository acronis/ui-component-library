<script>
  import { AcvOption, AcvSelect } from '@/components';
  import { generateLongOptions } from '../../__mocks__/data.select.generateOptions.js';

  export default {
    components: {
      AcvSelect,
      AcvOption
    },
    data() {
      return {
        placement: {
          default: generateLongOptions()()
        },
        maxWidth: {
          tree: {
            value: ''
          }
        },
      };
    }
  };
</script>

<template>
  <PreviewGroup class="qa-select-title-popup">
    <Preview
      name="Max width"
      span="8"
    >
      <AcvSelect
        v-model="placement.default.value"
        popper-max-width="252px"
        label="Label"
      >
        <AcvOption
          v-for="item in placement.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Max width tree"
      span="8"
    >
      <AcvSelect
        v-model="maxWidth.tree.value"
        popper-max-width="252px"
        label="Label"
      >
        <acv-tree
          :data="[{
            label: 'Very long items in select with tree It is really very long items - Level 1',
            value: 'level 1',
            children: [
              {
                label: 'Very long items in select with tree It is really very long items - Level 2',
                value: 'level 2',
              },
            ],
          }]"
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
