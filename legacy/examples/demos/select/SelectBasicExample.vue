<script>
  import AcvOption from '@/components/option/option.vue';
  import AcvSelect from '@/components/select/select.vue';
  import { generateTenOptions, gg } from '../../__mocks__/data.select.generateOptions.js';

  export default {
    components: {
      AcvSelect,
      AcvOption
    },
    data() {
      return {
        basic: {
          default: gg()(),
          defaultFilled: gg()('Option 1'),
          scrollbar: generateTenOptions()(),
          small: gg()(),
          smallFilled: gg()('Option 1'),
          smallWithoutLabel: gg()()
        }
      };
    },

  // computed: {
  //   dynamicOptions() {
  //     const dynamicOptions = [];
  //     Array.from({ length: this.optionCount }).forEach((element, index) => {
  //       dynamicOptions.push({
  //         label: 'Option'.concat(index),
  //         value: index
  //       });
  //     });
  //
  //     return dynamicOptions;
  //   },
  //   displayText() {
  //     return `You selected ${this.customText.default.value.length} option(s)`;
  //   },
  //   weeksDisplayText() {
  //     const { value, options } = this.customText.weeks;
  //     return value.length === options.length ? 'All weeks' : value.join(', ');
  //   },
  //   daysDisplayText() {
  //     const { value, options } = this.customText.days;
  //     return value.length === options.length ? 'All days' : value.join(', ');
  //   },
  //   hasSelectPrefix() {
  //     return this.slots.select.prefix !== '';
  //   },
  //   selectPrefixIcon() {
  //     return this.slots.options[this.slots.select.prefix].icon;
  //   },
  //   hasSelectSuffix() {
  //     return this.slots.select.suffix !== '';
  //   },
  //   selectSuffixIcon() {
  //     return this.slots.options[this.slots.select.suffix].icon;
  //   },
  //   selectPrefixColor() {
  //     return this.slots.options[this.slots.select.prefix].color;
  //   },
  //   selectSuffixColor() {
  //     return this.slots.options[this.slots.select.suffix].color;
  //   }
  // },
  //
  // mounted() {
  //   this.list = getOptionsCities();
  // },
  //
  // methods: {
  //   remoteMethodSingle(query) {
  //     this.serverSearch.singleLoading = true;
  //     this.serverSearch.singleScrollEnd = false;
  //     setTimeout(() => {
  //       this.serverSearch.singleLoading = false;
  //       const queryResults = this.list.filter((item) => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
  //       this.serverSearch.singleOptions = queryResults.slice(0, 10);
  //       if (this.serverSearch.singleOptions.length < 10) this.serverSearch.singleScrollEnd = true;
  //       this.serverSearch.singleScrollCurser = 10;
  //       this.serverSearch.singleSearchCount = queryResults.length;
  //     }, 300);
  //   },
  //
  //   remoteScrollMethodSingle(query) {
  //     this.serverSearch.singleScrollLoading = true;
  //     setTimeout(() => {
  //       this.serverSearch.singleScrollLoading = false;
  //       const queryResults = this.list.filter((item) => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1).slice(this.serverSearch.singleScrollCurser, this.serverSearch.singleScrollCurser + 10);
  //       this.serverSearch.singleScrollCurser += queryResults.length;
  //       if (queryResults.length < 10) this.serverSearch.singleScrollEnd = true;
  //       this.serverSearch.singleOptions = this.serverSearch.singleOptions.concat(queryResults);
  //     }, 1500);
  //   },
  //
  //   remoteMethodMultiple(query) {
  //     this.serverSearch.multipleLoading = true;
  //     this.serverSearch.multipleScrollEnd = false;
  //     setTimeout(() => {
  //       this.serverSearch.multipleLoading = false;
  //       const queryResults = this.list.filter((item) => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
  //       this.serverSearch.multipleOptions = queryResults.slice(0, 10);
  //       if (this.serverSearch.multipleOptions.length < 10) this.serverSearch.multipleScrollEnd = true;
  //       this.serverSearch.multipleScrollCurser = 10;
  //       this.serverSearch.multipleSearchCount = queryResults.length;
  //     }, 300);
  //   },
  //
  //   remoteScrollMethodMultiple(query) {
  //     this.serverSearch.multipleScrollLoading = true;
  //     setTimeout(() => {
  //       this.serverSearch.multipleScrollLoading = false;
  //       const queryResults = this.list.filter((item) => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1).slice(this.serverSearch.multipleScrollCurser, this.serverSearch.multipleScrollCurser + 10);
  //       this.serverSearch.multipleScrollCurser += queryResults.length;
  //       if (queryResults.length < 10) this.serverSearch.multipleScrollEnd = true;
  //       this.serverSearch.multipleOptions = this.serverSearch.multipleOptions.concat(queryResults);
  //     }, 1500);
  //   },
  //
  //   onCheckChange() {
  //     const checkedNodes = this.$refs.lazytree?.getCheckedNodes(2) || [];
  //     this.tree.lazy.customText = checkedNodes.length > 0 ? checkedNodes.map((node) => node.label).join(', ') : 'Select';
  //   }
  // }
  };
</script>

<template>
  <PreviewGroup class="qa-select-basic">
    <Preview
      name="Default"
      span="8"
    >
      <AcvSelect
        v-model="basic.default.value"
        label="Label"
      >
        <AcvOption
          v-for="item in basic.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="With predefined value"
      span="8"
    >
      <AcvSelect
        v-model="basic.defaultFilled.value"
        label="Label"
      >
        <AcvOption
          v-for="item in basic.defaultFilled.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="With scrollbar"
      span="8"
    >
      <AcvSelect
        v-model="basic.scrollbar.value"
        label="Label"
      >
        <AcvOption
          v-for="item in basic.scrollbar.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Default"
      span="8"
    >
      <AcvSelect
        v-model="basic.small.value"
        label="Label"
        size="small"
      >
        <AcvOption
          v-for="item in basic.small.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="With predefined value"
      span="8"
    >
      <AcvSelect
        v-model="basic.smallFilled.value"
        label="Label"
        size="small"
      >
        <AcvOption
          v-for="item in basic.smallFilled.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Without label"
      span="8"
    >
      <AcvSelect
        v-model="basic.smallWithoutLabel.value"
        size="small"
      >
        <AcvOption
          v-for="item in basic.smallWithoutLabel.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Hide on scroll"
      span="8"
    >
      <AcvSelect
        v-model="basic.scrollbar.value"
        label="Label"
        hide-on-scroll
      >
        <AcvOption
          v-for="item in basic.scrollbar.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Translucent"
      span="8"
      class="dark-bg"
    >
      <div class="dark-bg">
        <AcvSelect
          v-model="basic.default.value"
          label="Label"
          translucent
        >
          <AcvOption
            v-for="item in basic.default.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </AcvSelect>
      </div>
    </Preview>
    <Preview
      name="Disabled options"
      span="8"
    >
      <AcvSelect
        v-model="basic.default.value"
        label="Label"
      >
        <AcvOption
          v-for="item in basic.default.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          disabled
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Prevent Hide on click"
      span="8"
    >
      <AcvSelect
        v-model="basic.scrollbar.value"
        label="Label"
        prevent-hide-on-click
      >
        <AcvOption
          v-for="item in basic.scrollbar.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>

<style scoped>
.value-json-preview {
  min-height: 40px;
  margin-bottom: 16px;
  overflow-y: auto;
  font-size: var(--acv-font-size-title);
  width: 100%;
  color: var(--acv-color-gray);
}

.dark-bg {
  width: 100%;
  background-color: var(--acv-color-nav-primary);
  background-clip: padding-box;
}

.dark-bg :deep(.preview__caption) {
  color: var(--acv-color-nav-primary);
}

.box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
</style>
