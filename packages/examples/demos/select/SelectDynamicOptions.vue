<script>
  import { AcvNumPicker, AcvOption, AcvSelect } from '@/components';
  import { gg } from '../../__mocks__/data.select.generateOptions.js';

  const _statuses = [
    {
      label: 'Not defined',
      icon: 'i-ban-o--16',
      color: 'brand-light'
    },
    {
      label: 'Approved',
      icon: 'i-check-circle--16',
      color: 'fixed-success'
    },
    {
      label: 'Declined',
      icon: 'i-times-circle--16',
      color: 'fixed-danger'
    }
  ];

  export default {
    components: {
      AcvSelect,
      AcvOption,
      AcvNumPicker
    },
    data() {
      return {
        optionCount: 0,
        dynamic: {
          single: gg()([]),
          multiple: gg()([]),
          tree: {
            value: ['testing dynamic width with long strings'],
            data: [
              {
                label: 'testing dynamic width with long strings',
                value: 'testing dynamic width with long strings',
                children: [{
                  label: 'testing dynamic width with long strings children - 1-1',
                  value: 'testing dynamic width with long strings children - 1-1',
                  children: [{
                    label: 'testing dynamic width with long strings children-1-1-1',
                    value: 'testing dynamic width with long strings children-1-1-1',
                    children: [{
                      label: 'testing dynamic width with long strings children-1-1-1-1',
                      value: 'testing dynamic width with long strings children-1-1-1-1'
                    }]

                  }]
                }]
              },
              {
                label: 'testing dynamic width with long strings-2',
                value: 'testing dynamic width with long strings-2',
                children: [{
                  label: 'testing dynamic width with long strings children - 2-2',
                  value: 'testing dynamic width with long strings children - 2-2',
                  children: [{
                    label: 'testing dynamic width with long strings children-2-2-2',
                    value: 'testing dynamic width with long strings children-2-2-2',
                    children: [{
                      label: 'testing dynamic width with long strings children-2-2-2-2',
                      value: 'testing dynamic width with long strings children-2-2-2-2'
                    }]

                  }]
                }]
              },
            ]
          }
        },
      };
    },
    computed: {
      dynamicOptions() {
        const dynamicOptions = [];
        Array.from({ length: this.optionCount }).forEach((element, index) => {
          dynamicOptions.push({
            label: 'Option'.concat(index),
            value: index
          });
        });
        return dynamicOptions;
      }
    }
  };
</script>

<template>
  <PreviewGroup>
    <Preview
      name="No of Options"
      span="8"
    >
      <AcvNumPicker
        v-model="optionCount"
        :min="0"
      />
    </Preview>
    <Preview
      name="Dynamic Options - single"
      span="8"
    >
      <AcvSelect
        v-model="dynamic.single.value"
        label="Label"
      >
        <template
          v-if="dynamicOptions.length"
        >
          <AcvOption
            v-for="item in dynamicOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            checkbox
          />
        </template>
      </AcvSelect>
    </Preview>
    <Preview
      name="Dynamic Options - Single"
      span="8"
    >
      <AcvSelect
        v-model="dynamic.multiple.value"
        multiple
        select-all
        :multiple-show-items-limit="5"
        label="Label"
      >
        <template
          v-if="dynamicOptions.length"
        >
          <AcvOption
            v-for="item in dynamicOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            checkbox
          />
        </template>
      </AcvSelect>
    </Preview>
    <Preview
      name="Dynamic Width"
      span="8"
    >
      <AcvSelect
        v-model="dynamic.tree.value"
        dynamic-width
        label="Label"
      >
        <acv-tree
          :data="dynamic.tree.data"
          node-key="value"
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
