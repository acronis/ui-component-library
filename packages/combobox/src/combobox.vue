<template>
  <div class="el-combobox">
    <el-select
      ref="select"
      v-model="currentValue"
      v-bind="$attrs"
      :disabled="disabled"
      :size="size"
      :placeholder="placeholder"
      :search-placeholder="searchPlaceholder"
      :type="type"
      :readonly="false"
      :change-on-options-removal="false"
      :custom-hint="computedTitle"
      :show-dropdown="showDropdown"
      open-on-icon-click
      @visible-change="visible = !visible"
    >
      <slot />
      <template #suffix>
        <el-divider
          vertical
          :color="disabled ? 'brand-lightest': 'brand-light'"
        />
        <el-icon
          :name="iconName"
          :tabindex="!disabled ? 0 : -1"
          class="el-input__icon el-combobox__trigger"
          :class="{ 'el-combobox__trigger--dropdown-visible': visible }"
          @keydown.enter.prevent.stop="toggleDropdown"
          @click="$refs.select.handleClick($event)"
        />
      </template>
    </el-select>
  </div>
</template>

<script>
  import Emitter from '@/mixins/emitter';
  import Focus from '@/mixins/focus';
  import ElIcon from 'packages/icon';
  import ElSelect from 'packages/select';
  import ElDivider from 'packages/divider';
  import { t } from '@/locale';

  export default {
    mixins: [Emitter, Focus('select')],
    name: 'ElCombobox',

    componentName: 'ElCombobox',

    components: {
      ElIcon,
      ElDivider,
      ElSelect
    },

    inject: {
      elFormItem: {
        default: ''
      }
    },

    props: {
      value: {
        required: true
      },
      size: {
        type: String,
        default: 'large'
      },
      disabled: Boolean,
      placeholder: {
        type: String,
        default() {
          return t('el.combobox.placeholder');
        }
      },
      searchPlaceholder: {
        type: String,
        default() {
          return t('el.combobox.searchPlaceholder');
        }
      },
      type: {
        type: String,
        default: 'text',
        validator: (value) => ['text', 'password', 'number'].indexOf(value) > -1
      },
      defaultType: {
        type: String,
        default: 'password'
      },
      icon: String
    },

    data() {
      return {
        currentValue: this.value,
        visible: false,
        showDropdown: false
      };
    },

    computed: {
      iconName() {
        if (this.icon) {
          return this.icon;
        }

        switch (this.type) {
          case 'password':
            return 'i-key-o--16';

          case 'text':
          default:
            return this.visible ? 'i-chevron-up--16' : 'i-chevron-down--16';
        }
      },

      computedTitle() {
        return (!this.currentValue || !this.currentValue.length) ? this.placeholder : null;
      }
    },

    watch: {
      currentValue(val) {
        this.$emit('input', val);
        this.dispatch('ElFormItem', 'el.form.input', val);
      },

      value(val) {
        this.currentValue = val;
      }
    },

    mounted() {
      this.$refs.select.$on('change', (value) => {
        this.$emit('change', value);
        this.dispatch('ElFormItem', 'el.form.change', value);
        this.dispatch('ElFormItem', 'el.form.input', value);
      });
      this.$refs.select.$on('focus', (value) => {
        this.$emit('focus', value);
        this.dispatch('ElFormItem', 'el.form.focus', value);
      });
      this.$refs.select.$on('blur', (value) => {
        this.$emit('blur', value);
        this.dispatch('ElFormItem', 'el.form.blur', value);
      });
      this.$refs.select.$on('visible-change', (value) => {
        this.$emit('visible-change', value);
      });
    },

    methods: {
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      }
    }
  };
</script>
