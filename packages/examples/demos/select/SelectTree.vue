<script>
  import { AcvOption, AcvSelect } from '@/components';
  import { treeDataGen } from '../../__mocks__/data.select.generateOptions.js';

  export default {
    components: {
      AcvSelect,
      AcvOption,
    },
    data() {
      return {
        tree: {
          default: {
            value: '0-0-0',
            data: treeDataGen(2, 3)
          },
          lazy: {
            value: '',
            load: (node, resolve) => {
              if (node.level === 0) {
                return resolve([
                  { value: 'node-1', label: 'node-1' },
                  { value: 'node-2', label: 'node-2' }
                ]);
              }
              if (node.level > 2) {
                return resolve([]);
              }
              setTimeout(() => {
                resolve([
                  { value: `${node.data.value}-1`, label: `${node.data.value}-1` },
                  { value: `${node.data.value}-2`, label: `${node.data.value}-2` }
                ]);
              }, 500);
            }
          },
          icons: {
            value: '0-0-0',
            data: treeDataGen(2, 3, null, 'i-customer-o--16', 'brand-primary')
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
        v-model="tree.default.value"
        label="Label"
      >
        <acv-tree
          :data="tree.default.data"
          node-key="value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="With common option"
      span="8"
    >
      <AcvSelect
        v-model="tree.default.value"
        label="Label"
      >
        <template #default>
          <AcvOption value="all" />
          <acv-tree
            :data="tree.default.data"
            node-key="value"
          />
        </template>
      </AcvSelect>
    </Preview>
    <Preview
      name="Lazy loading"
      span="8"
    >
      <AcvSelect
        v-model="tree.lazy.value"
        label="Label"
      >
        <acv-tree
          :load="tree.lazy.load"
          node-key="value"
          lazy
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Multiple lazy loading with custom text"
      span="8"
    >
      <AcvSelect
        v-model="tree.lazy.multipleValue"
        label="Label"
        multiple
        dynamic-width
        :custom-text="tree.lazy.customText"
      >
        <acv-tree
          :emit-current-change-only-on-leaf="false"
          :expand-when-checked="false"
          :load="tree.lazy.load"
          node-key="value"
          auto-expand-parent
          lazy
          show-checkbox
          @check-change="onCheckChange"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Multiple lazy loading with every node"
      span="8"
    >
      <AcvSelect
        v-model="tree.lazy.individualValue"
        label="Label"
        multiple
        clearable
        filterable
        :select-all="false"
        :multiple-show-items-limit="3"
      >
        <acv-tree
          :load="tree.lazy.load"
          node-key="value"
          lazy
          auto-expand-parent
          check-strictly
          expand-on-click-node
          show-checkbox
          :emit-current-change-only-on-leaf="false"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="With icons"
      span="8"
    >
      <AcvSelect
        v-model="tree.icons.value"
        label="Label"
      >
        <acv-tree
          :data="tree.icons.data"
          node-key="value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="With icons and with icons for selected item"
      span="8"
    >
      <AcvSelect
        v-model="tree.icons.value"
        label="Label"
        size="small"
        show-selected-icon
      >
        <acv-tree
          :data="tree.icons.data"
          node-key="value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Translucent with icon for selected item"
      span="8"
      class="dark-bg"
    >
      <div class="dark-bg">
        <AcvSelect
          v-model="tree.icons.value"
          label="Label"
          size="small"
          show-selected-icon
          translucent
        >
          <acv-tree
            :data="tree.icons.data"
            node-key="value"
          />
        </AcvSelect>
      </div>
    </Preview>
  </PreviewGroup>
</template>
