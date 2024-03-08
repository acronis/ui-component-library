<template>
  <div
    :style="{width}"
  >
    <label
      :class="['el-file-picker', {
        [`el-file-picker--${size}`]: true,
        'el-file-picker--filled': !!selectedValue,
        'el-file-picker--focus': focused
      }]"
      :title="selectedValue"
    >
      <input
        ref="input"
        type="file"
        class="el-file-picker__input"
        v-bind="$props"
        :name="name"
        :aria-label="computedLabel"
        :disabled="disabled"
        :accept="accept"
        @change="handleChange"
        @click="handleFocus"
      >
      <span
        class="el-file-picker__inner"
        :class="[{
          'el-file-picker__inner--error': hasError
        }]"
      >
        <span
          :class="['el-file-picker__label', {
            'el-file-picker__label--top': !!selectedValue
          }]"
        >
          {{ computedLabel }}
        </span>

        <span
          v-if="selectedValue"
          class="el-file-picker__value"
        >{{ selectedValue }}</span>

        <el-button
          v-if="selectedValue"
          type="ghost"
          :disabled="disabled"
          :class="['el-file-picker__remove-button', {
            'el-file-picker__remove-button--error': hasError
          }]"
          @click.prevent="removeFile"
        >
          <el-icon name="i-times--16" />
        </el-button>

        <span
          :class="['el-file-picker__browse', {
            'el-file-picker__browse--has-file': selectedValue && !hasError,
            'el-file-picker__browse--has-file-error': selectedValue && hasError,
          }]"
        >
          <el-icon
            v-if="showIcon"
            :name="icon"
          />
          <span v-else>{{ computedBrowseText }}</span>
        </span>
      </span>
    </label>
    <p
      v-if="(!hasError || !errorText) && !embedInFormItem"
      :class="['el-file-picker__instruction-text',
               'el-text--caption',
               'el-text--ellipsis',
               'el-display--inline-block',
               'el-text--color-fixed-light'
      ]"
      class=""
    >
      {{ instructionText }}
    </p>
    <p
      v-else-if="!embedInFormItem"
      :class="['el-file-picker__error-text',
               'el-text--caption',
               'el-text--ellipsis',
               'el-display--inline-block',
               'el-text--color-fixed-danger'
      ]"
    >
      {{ errorText }}
    </p>
    <p
      v-if="embedInFormItem && !elFormItemIsInvalid() && instructionText"
     :class="['el-file-picker__instruction-text',
              'el-text--caption',
              'el-text--ellipsis',
              'el-display--flex',
              'el-text--color-fixed-light'
      ]"
    >
      {{ instructionText }}
    </p>
  </div>
</template>

<script>
import Emitter from '@/mixins/emitter';
import Locale from '@/mixins/locale';
import ElIcon from 'packages/icon';
import ElButton from 'packages/button';

export default {
  name: 'ElFilePicker',

  componentName: 'ElFilePicker',

  components: {
    ElIcon,
    ElButton
  },

  mixins: [Emitter, Locale],

  props: {
    disabled: Boolean,
    name: String,
    width: {
      type: String,
      default: '100%'
    },
    label: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium'
    },
    icon: {
      type: String,
      default: 'i-search-o--16'
    },
    browseText: {
      type: String,
      default: ''
    },
    showIcon: Boolean,
    instructionText: {
      type: String,
      default: ''
    },
    errorOnLoad: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: ''
    },
    errorValidation: {
      type: Function,
      default: function () {
      }
    },
    formItemValue: {
      type: String,
      default: ''
    },
    embedInFormItem: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    }
  },

  model: {
    prop: 'formItemValue'
  },

  inject: {
    elFormItemIsInvalid: {
      default: () => false
    }
  },

  data() {
    return {
      selectedValue: '',
      focused: false,
      hasError: this.errorOnLoad || false
    };
  },
  computed: {
    computedLabel() {
      return this.label || this.t('el.filepicker.select');
    },
    computedBrowseText() {
      return this.browseText || this.t('el.filepicker.browse');
    }
  },
  watch: {
    selectedValue(value) {
      this.dispatch('ElFormItem', 'el.form.change', [value]);
      this.dispatch('ElFormItem', 'el.form.input', [value]);
    },
    formItemValue(val) {
      this.selectedValue = val;
    }
  },
  methods: {
    removeFile() {
      this.selectedValue = '';
      this.$refs.input.value = '';
      this.hasError = this.errorValidation.apply(null, null);
      this.$emit('delete');
      this.$emit('input', '');
    },
    handleChange(event) {
      this.hasError = this.errorValidation.apply(null, event.target.files);

      if (event.target.files && event.target.files[0] && event.target.files[0].name) {
        this.selectedValue = event.target.files && event.target.files[0] && event.target.files[0].name;
        this.focused = false;
        this.$emit('change', event.target.files, event);
        this.$emit('input', event.target.files[0].name, event);
      }
    },
    handleFocus() {
      if (!this.disabled) {
        this.focused = true;
      }
    }
  }
};
</script>
