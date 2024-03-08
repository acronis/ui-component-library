<script lang="jsx">
import NodeText from '@/mixins/node-text';
import Highlight from 'packages/highlight/src/directive';
import eventBus from '@/utils/eventBus';

export default {
  name: 'ElDropdownItem',

  directives: {
    Highlight
  },

  mixins: [NodeText],

  inject: ['dropdown'],

  props: {
    command: {},
    disabled: Boolean,
    visible: {
      type: Boolean,
      default: true
    },
    divided: Boolean,
    icon: {
      type: String,
      default: undefined
    },
    iconColor: {
      type: String,
      default: 'fixed-link'
    }
  },

  emits: ['select'],

  data() {
    return {
      highlightFormatText: this.text(),
      keyword: ''
    };
  },

  methods: {
    handleClick() {
      if (this.disabled) return;
      this.$el.blur();

      eventBus.$emit('el.dropdown.menu.item.click', [this.command, this]);
      // this.dispatch('ElDropdown', 'menu-item-click', [this.command, this]);
      // TODO remove useless event
      // this.$emit('select', e, this);
    },

    text() {
      const defaultSlot = this.$slots.default;
      if (typeof defaultSlot === 'function') {
        return this.getSlotTextContent(defaultSlot());
      }
      return null;
    },

    updateHighlightFormatText(keyword) {
      this.keyword = keyword;
    }
  },

  render() {
    const listAttributes = {
      class: {
        'qa-dropdown-menu-item': true,
        'el-dropdown-menu__item': true,
        'el-text--strong': true,
        'is-disabled': this.disabled,
        'is-visible': this.visible,
        'is-divided': this.divided,
        'is-sidebar': this.dropdown.isSidebar
      },
      attrs: {
        tabindex: this.disabled ? null : -1,
        'aria-disabled': this.disabled
      },
      on: {
        click: this.handleClick
      }
    };

    const iconContent = this.icon
      ? (<el-icon
              {...{ props: { name: this.icon, color: this.iconColor } }}
              class="mr-8 el-dropdown-menu__item-icon qa-dropdown-menu-item-icon"
          />)
      : '';
    let slot;

    if (this.dropdown.search) {
      slot = (
          <span
            ref="text"
            {...{
              directives: [{
                name: 'highlight',
                value: this.keyword
              }]
            }}
          >{this.text()}</span>
      );
    } else {
      slot = this.$slots.default?.();
    }

    return (
        <li {...listAttributes}>
          { iconContent }
          { slot }
        </li>
    );
  }
};
</script>
