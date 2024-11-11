<script>
  import { AcvOption, AcvSelect } from '@/components';
  import {
    getOptionsCities,
    gg,
    optionsGen,
    treeDataGen
  } from '../../__mocks__/data.select.generateOptions.js';

  export default {
    components: {
      AcvSelect,
      AcvOption
    },
    data() {
      return {
        search: {
          default: gg(() => getOptionsCities())(),
          tree: {
            value: [],
            data: treeDataGen(2, 3)
          }
        },
        multiple: {
          default: gg()([]),
          checkbox: gg()(['Option 3']),
          checkboxAll: gg()([]),
          checkboxAllItemSelectedText: gg()(optionsGen(8, 'Option').map(item => item.value)),
          clearable: gg()([]),
          checkboxDynamicOption: gg()([]),
          checkboxAllSearch: gg()([]),
          withTree: {
            value: ['0-0-0'],
            data: treeDataGen(2, 3)
          }
        },
        list: null,
        clearable: {
          default: gg(() => getOptionsCities())(),
          tree: {
            value: [],
            data: [
              {
                value: 'adobe',
                label: 'Adobe',
                children: [
                  { value: 'acrobat-reader', label: 'Acrobat Reader' },
                  { value: 'falsh-player', label: 'Flash Player' }
                ]
              },
              {
                value: 'microsoft',
                label: 'Microsoft',
                children: [
                  { value: 'office', label: 'Office' },
                  { value: 'edge', label: 'Edge' }
                ]
              },
            ]
          }
        }
      };
    },
    mounted() {
      this.list = getOptionsCities();
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
        v-model="search.default.value"
        filterable
        label="Label"
      >
        <AcvOption
          v-for="item in search.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Tree"
      span="8"
    >
      <AcvSelect
        v-model="search.tree.value"
        label="Label"
        filterable
      >
        <acv-tree
          :data="search.tree.data"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Clearable"
      span="8"
    >
      <AcvSelect
        v-model="clearable.default.value"
        clearable
        filterable
        label="Label"
      >
        <AcvOption
          v-for="item in clearable.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Using select all"
      span="8"
    >
      <AcvSelect
        v-model="multiple.checkboxAllSearch.value"
        multiple
        select-all
        filterable
        :multiple-show-items-limit="5"
        label="Label"
      >
        <AcvOption
          v-for="item in clearable.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          checkbox
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
