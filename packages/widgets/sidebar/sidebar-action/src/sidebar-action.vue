<script lang="jsx">
  import NodeText from '@/mixins/node-text';
  import TabFocusable from '@/mixins/tab-focusable';

  export default {
  name: 'ElSidebarAction',

  mixins: [
    NodeText,
    TabFocusable
  ],

  inject: {
    dropdown: {
      default: { visible: false }
    }
  },

  props: {
    command: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: undefined
    },
    iconColor: {
      type: String,
      default: 'brand-primary'
    },
    actionGroup: {
      type: Boolean,
      default: false
    }
  },
  emits: ['command'],

  methods: {
    handleClickAction() {
      if (!this.actionGroup) {
        this.$emit('command', this.command);
      }
    },

    text() {
      const defaultSlots = this.$slots.default;
      if (defaultSlots) {
        return this.getSlotTextContent(defaultSlots());
      }
      return null;
    }
  },

  render() {
    const listAttributes = {
      class: {
        'el-sidebar-action': true,
        'is-focus': this.isFocus,
        'is-active': this.dropdown.visible
      },
      attrs: {
        title: this.text(),
        tabindex: 0
      },
      on: {
        click: this.handleClickAction,
        keydown: (e) => {
          if (e.keyCode === 13) {
            this.handleEnterKeyDown(e);
          }
        },
        keyup: (e) => {
          if (e.keyCode === 13) {
            this.handleEnterKeyUp(e);
          }
        },
        mousedown: this.handleMouseDown,
        mouseup: this.handleMouseUp,
        focus: this.handleFocus,
        blur: this.handleBlur
      }
    };
    const iconContent = this.icon
      ? (<el-icon name={this.icon} class="mr-16 ml-8 el-sidebar-action__icon"/>)
      : '';
    const actionGroupIcon = this.actionGroup
      ? (<el-icon name={'i-chevron-right--16'} class="mr-8 el-sidebar-action__action-group-icon"/>)
      : '';
    const slot = this.$slots.default?.();
    return (
        <li {...listAttributes}>
          { iconContent }
          { slot }
          { actionGroupIcon }
        </li>
    );
  }
};
</script>
