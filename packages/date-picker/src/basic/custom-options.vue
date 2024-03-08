<template>
  <div class="px-16 py-8 el-custom-options">
    <el-checkbox-group
      v-model="checkedOptions"
    >
      <el-checkbox
        v-for="option in customOptions"
        :key="option.key"
        class="pr-16 el-custom-options__item"
        :label="option.key"
        @change="handleSelectChange"
      >
        {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>
    <el-checkbox
      v-if="customOptionSelectAll"
      :value="isAllSelected"
      @change="handleAllSelectChange"
    >
      {{ customOptionSelectAll }}
    </el-checkbox>
  </div>
</template>

<script>
  import ElCheckbox from 'packages/checkbox';
  import ElCheckboxGroup from 'packages/checkbox-group';

  export default {
    name: 'ElCustomOptions',

    components: {
      ElCheckbox,
      ElCheckboxGroup
    },

    props: {
      customOptions: Array,
      selectedOptions: Array,
      customOptionSelectAll: String,
      isAllSelected: Boolean
    },

    data() {
      return {
        checkedOptions: [],
        allSelectState: false
      };
    },

    watch: {
      checkedOptions(options) {
        this.$emit('update:selectedOptions', options);
      },

      selectedOptions() {
        this.checkedOptions = this.selectedOptions;
      },

      isAllSelected(newValue) {
        this.allSelectState = newValue;
      }
    },

    mounted() {
      this.checkedOptions = this.selectedOptions;
      this.allSelectState = this.isAllSelected;
    },

    methods: {
      handleAllSelectChange(isChecked) {
        this.$emit('select-all', isChecked);
        if (isChecked) {
          this.allSelectState = true;
        } else {
          this.allSelectState = false;
        }
      },
      handleSelectChange(isChecked, event) {
        // pass the selected option like first day or last day
        this.$emit('select-option', isChecked, event.target.value);
      }
    }
  };
</script>
