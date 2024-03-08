<template>
  <div>
    <el-popover
      v-model="popoverModel"
      placement="bottom-start"
      @show="showPopover"
    >
      <el-form
        ref="form"
        class="el-filter__form"
        tabindex="-1"
        :model="filters"
        :rules="formRules"
        @status="handleFormStatusChange"
        @submit="handleSubmit"
      >
        <slot :filters="filters" />
        <el-divider />
        <div class="el-filter__footer">
          <div class="el-filter__reset">
            <el-button
              v-if="!isResetDefaultHidden"
              class="qa-filter-reset my-16 ml-16 mr-24 el-filter__button-max-width"
              type="ghost"
              @click="handleDefaultResetClick"
            >
              {{ t('el.filter.resetDefault') }}
            </el-button>
          </div>
          <div class="my-16 mr-24">
            <el-button
              class="qa-filter-cancel el-filter__button-max-width"
              type="secondary"
              @click="handleCancelClick"
            >
              {{ t('el.filter.cancel') }}
            </el-button>
            <el-button
              class="qa-filter-apply el-filter__button-max-width"
              native-type="submit"
              :loading="status === 'applying'"
              :disabled="isApplyDisable"
            >
              {{ t('el.filter.apply') }}
            </el-button>
          </div>
        </div>
      </el-form>
      <template #reference>
        <el-button
          type="ghost"
          :icon="icon"
          class="qa-filter-trigger el-filter__button-max-width"
          :class="{'is-selected': popoverModel }"
          @click="handleIconClick"
        >
          <div
            v-if="count"
            class="el-filter__counter"
            v-text="count"
          />
          {{ t('el.filter.filterButton') }}
        </el-button>
      </template>
    </el-popover>
  </div>
</template>

<script>
  import Locale from '@/mixins/locale';
  import ElDivider from 'packages/divider';
  import ElForm from 'packages/form';

  export default {
    name: 'ElFilter',
    componentName: 'ElFilter',
    components: {
      ElDivider,
      ElForm
    },
    mixins: [Locale],
    props: {
      value: {
        type: Object,
        default: () => {}
      },
      applyCallback: {
        type: Function,
        default: (done) => { done(); }
      },
      defaults: {
        type: Object
      },
      formRules: {
        type: Object,
        default: () => ({})
      }
    },
    data: () => ({
      status: 'applied',
      filters: {},
      filtersDefault: {},
      popoverModel: false,
      isFormValid: true
    }),
    computed: {
      isApplyDisable() {
        return (this.value && this.isEqual(this.value, this.filters) || !this.isFormValid) && this.status !== 'applying';
      },
      icon() {
        return this.filtersCount ? 'i-placeholder--16' : 'i-tune--16';
      },
      count() {
        return this.filtersCount >= 10 ? '9+' : this.filtersCount;
      },
      filtersCount() {
        const value = this.value;
        if (!value) {
          return 0;
        }

        let result = 0;
        Object.values(value).forEach((item) => {
          if (Array.isArray(item)) {
            if (item.length) {
              result++;
            }
          } else if (['number', 'string', 'boolean', 'object'].indexOf(typeof item) !== -1 && Boolean(item)) {
            result++;
          }
        });
        return result;
      },
      isResetDefaultHidden() {
        return this.isEqual(this.filters, this.filtersDefault);
      }
    },
    watch: {
      value: {
        handler(value) {
          if (!value) {
            return;
          }
          if (Object.keys(value).length) {
            this.filters = { ...value };
          } else {
            this.handleResetClick();
          }
        },
        deep: true
      },
      defaults(value) {
        this.filtersDefault = { ...value };
      }
    },
    mounted() {
      // be aware, only parent object was cloned, but not children objects (reactivity still work)
      this.filters = { ...this.value };
      this.filtersDefault = { ...(this.defaults || this.value) };
    },
    methods: {
      handleResetClick() {
        Object.keys(this.filters).forEach((key) => {
          if (Array.isArray(this.filters[key])) {
            this.filters[key] = [];
            return;
          }
          if (typeof this.filters[key] === 'string') {
            this.filters[key] = '';
            return;
          }
          if (typeof this.filters[key] === 'number') {
            this.filters[key] = 0;
            return;
          }
          if (typeof this.filters[key] === 'boolean') {
            this.filters[key] = false;
            return;
          }
          this.filters[key] = null;
        });
        this.$refs.form?.clearValidate();
      },
      handleDefaultResetClick() {
        this.filters = { ...this.filtersDefault };
      },
      handleFormStatusChange({ value, name }) {
        if (Object.keys(this.formRules).length && name === 'valid') {
          this.isFormValid = value;
        }
      },
      handleSubmit() {
        this.status = 'applying';
        this.$emit('input', { ...this.filters });
        this.applyCallback(this.close);
      },
      handleCancelClick() {
        this.filters = { ...this.value };
        this.close();
      },
      handleIconClick() {
        if (!this.popoverModel && this.$slots.default) {
          this.popoverModel = false;
        }
        if (!this.popoverModel) {
          this.handleCancelClick();
        }
      },
      showPopover() {
        this.filters = { ...this.value };
        this.status = 'editing';
        this.$nextTick(() => {
          this.$refs.form.$el.focus();
        });
      },
      close() {
        this.popoverModel = false;
        this.status = 'applied';
      },
      isEqual(first, second) {
        if (Object.keys(first).length !== Object.keys(second).length) {
          return false;
        }
        return Object.keys(first).every((key) => {
          if (Array.isArray(first[key]) && Array.isArray(second[key])) {
            return first[key].join() === second[key].join();
          }
          if (first[key] !== second[key]) {
            return false;
          }
          return true;
        });
      }
    }
  };
</script>
