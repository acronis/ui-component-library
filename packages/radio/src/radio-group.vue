<template>
  <div
    class="el-radio-group"
    :class="{
      'is-invalid': isInvalid
    }"
    role="radiogroup"
    @keydown="handleKeydown"
  >
    <div class="el-radio-group__content">
      <slot />
    </div>
  </div>
</template>

<script>
  import Emitter from '@/mixins/emitter';
  import Size from '@/mixins/size';
  import eventBus from '@/utils/eventBus';

  const keyCode = Object.freeze({
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  });

  export default {
    name: 'ElRadioGroup',

    componentName: 'ElRadioGroup',

    mixins: [
      Emitter,
      Size
    ],

    inject: {
      elFormItem: {
        default: {}
      }
    },

    props: {
      value: {},
      disabled: Boolean
    },

    computed: {
      isInvalid() {
        return this.elFormItem.validateState === 'error';
      }
    },

    watch: {
      value() {
        this.dispatch('ElFormItem', 'el.form.change', [this.value]);
        this.dispatch('ElFormItem', 'el.form.input', [this.value]);
      }
    },

    created() {
      eventBus.$on('handleChange', (value) => {
        this.$emit('change', value);
      });
    },

    mounted() {
      const radios = this.$el.querySelectorAll('[type=radio]');
      const firstLabel = this.$el.querySelectorAll('[role=radio]')[0];
      if (![].some.call(radios, (radio) => radio.checked) && firstLabel) {
        firstLabel.tabIndex = 0;
      }
    },

    methods: {
      handleKeydown(e) {
        const target = e.target;
        const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]';
        const radios = this.$el.querySelectorAll(className);
        const length = radios.length;
        const index = [].indexOf.call(radios, target);
        const roleRadios = this.$el.querySelectorAll('[role=radio]');
        if (target && target.type === 'radio') {
          switch (e.keyCode) {
            case keyCode.LEFT:
            case keyCode.UP:
              e.stopPropagation();
              e.preventDefault();
              if (index === 0) {
                roleRadios[length - 1].click();
              } else {
                roleRadios[index - 1].click();
              }
              break;
            case keyCode.RIGHT:
            case keyCode.DOWN:
              if (index === (length - 1)) {
                e.stopPropagation();
                e.preventDefault();
                roleRadios[0].click();
              } else {
                roleRadios[index + 1].click();
              }
              break;
            default:
          }
        }
      }
    }
  };
</script>
