<template>
  <div
    class="el-password"
    :class="[
      {'is-error': isError },
      {'is-with-description': description }
    ]"
  >
    <div class="el-password__container">
      <el-input
        v-bind="$props"
        :show-password-icon="withIcon"
        :spellcheck="false"
        type="password"
        @update:model-value="onInput"
        @change="onChange"
        @blur="onBlur"
        @focus="onFocus"
        @click="onClick"
      />
      <div
        v-if="hasScore"
        class="el-password__score"
        :class="[
          {'el-password__score--weak': score === 1},
          {'el-password__score--normal': score === 2},
          {'el-password__score--strong': score === 3}
        ]"
      >
        <div />
        <div />
        <div />
      </div>
      <div class="el-password__description">
        {{ description }}
      </div>
    </div>
  </div>
</template>
<script>
import ElInput from './input.vue';

const { ...inputPropsCopy } = ElInput.props;

export default {
  name: 'ElPassword',

  componentName: 'ElPassword',

  components: {
    ElInput
  },

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  props: {
    ...inputPropsCopy,
    withIcon: {
      type: Boolean,
      default: false
    },
    defaultType: {
      type: String,
      default: 'password'
    },
    description: String,
    isError: Boolean,
    score: Number
  },

  emits: ['blur', 'click', 'focus', 'change', 'update:modelValue'],

  computed: {
    hasScore() {
      return !isNaN(+this.score);
    }
  },

  methods: {
    onInput(val) {
      this.$emit('update:modelValue', val);
    },
    onChange(val) {
      this.$emit('change', val);
    },
    onFocus(e) {
      this.$emit('focus', e);
    },
    onBlur(e) {
      this.$emit('blur', e);
    },
    onClick(e) {
      this.$emit('click', e);
    }
  }
};
</script>
