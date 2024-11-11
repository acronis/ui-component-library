<script>
  import { AcvOption, AcvSelect } from '@/components';
  import { optionsGen, treeDataGen } from '../../__mocks__/data.select.generateOptions.js';

  export default {
    components: {
      AcvSelect,
      AcvOption
    },
    data() {
      return {
        customizedIcon: {
          default: {
            value: '',
            options: optionsGen(5, 'Item')
              .map(x => ({
                ...x,
                icon: 'folder-o'
              }))
          },
          tree: {
            value: '',
            data: treeDataGen(2, 3, null, 'folder-o', 'fixed-success')
          },
          iconColor: {
            value: '',
            options: [
              {
                color: 'brand-primary',
                icon: 'i-info-circle--16',
                value: 'Info'
              },
              {
                color: 'fixed-success',
                icon: 'i-check-circle--16',
                value: 'Success'
              },
              {
                color: 'fixed-danger',
                icon: 'i-times-circle--16',
                value: 'Error'
              },
              {
                color: 'fixed-warning',
                icon: 'i-exclamation-triangle--16',
                value: 'Warning'
              }
            ]
          }
        }
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
        v-model="customizedIcon.default.value"
        label="Label"
      >
        <AcvOption
          v-for="item in customizedIcon.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :icon="item.icon"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Using tree"
      span="8"
    >
      <AcvSelect
        v-model="customizedIcon.tree.value"
        multiple
        label="Label"
      >
        <acv-tree
          :data="customizedIcon.tree.data"
          node-key="value"
          show-checkbox
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Icon with custom color"
      span="8"
    >
      <AcvSelect
        v-model="customizedIcon.iconColor.value"
        label="Label"
        multiple
      >
        <AcvOption
          v-for="item in customizedIcon.iconColor.options"
          :key="item.value"
          :label="item.value"
          :value="item.value"
          :icon="item.icon"
          :icon-color="item.color"
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
