<script>
  import { AcvOption, AcvSelect } from '@/components';
  import { gg, optionsGen, treeDataGen } from '../../__mocks__/data.select.generateOptions.js';

  export default {
    components: {
      AcvSelect,
      AcvOption
    },
    data() {
      return {
        multiple: {
          default: gg()([]),
          checkbox: gg()([]),
          checkboxAll: gg()([]),
          checkboxAllItemSelectedText: gg()(optionsGen(8, 'Option').map(item => item.value)),
          clearable: gg()([]),
          withTree: {
            value: ['0-0-0'],
            data: treeDataGen(2, 3)
          }
        },
      };
    }
  };
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Default"
      span="8"
    >
      <AcvSelect
        v-model="multiple.checkbox.value"
        multiple
        :multiple-show-items-limit="5"
        label="Label"
      >
        <AcvOption
          v-for="item in multiple.checkbox.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          checkbox
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Using tree"
      span="8"
    >
      <AcvSelect
        v-model="multiple.withTree.value"
        label="Label"
        multiple
      >
        <acv-tree
          :data="multiple.withTree.data"
          node-key="value"
          show-checkbox
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Using select all"
      span="8"
    >
      <AcvSelect
        v-model="multiple.checkboxAll.value"
        multiple
        select-all
        :multiple-show-items-limit="5"
        label="Label"
      >
        <AcvOption
          v-for="item in multiple.checkbox.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          checkbox
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Using all items selected text"
      span="8"
    >
      <AcvSelect
        v-model="multiple.checkboxAllItemSelectedText.value"
        multiple
        select-all
        :multiple-show-items-limit="5"
        all-items-selected-text="All items selected"
        label="Label"
      >
        <AcvOption
          v-for="item in multiple.checkbox.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          checkbox
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Using clearable"
      span="8"
    >
      <AcvSelect
        v-model="multiple.clearable.value"
        multiple
        clearable
        :multiple-show-items-limit="5"
        label="Label"
      >
        <AcvOption
          v-for="item in multiple.checkbox.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          checkbox
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
