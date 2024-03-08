<script lang="jsx">
import { nextTick } from 'vue';

import ElButton from 'packages/button';
import { DropdownPlacements, DropdownTrigger, DropdownType } from 'packages/dropdown/src/DropdownTypes';
import ElIcon from 'packages/icon';
import ElSplitButton from 'packages/split-button';
import Clickoutside from '@/utils/clickoutside';
import eventBus from '@/utils/eventBus';
import { generateId } from '@/utils/util';

export default {
  name: 'ElDropdown',

  directives: { Clickoutside },

  components: {
    ElIcon,
    ElButton,
    ElSplitButton
  },

  provide() {
    return {
      dropdown: this
    };
  },

  props: {
    trigger: {
      type: String,
      default: DropdownTrigger.click,
      validator: (value) => Object.values(DropdownTrigger).indexOf(value) > -1
    },
    type: {
      type: String,
      validator: (value) => Object.values(DropdownType).indexOf(value) > -1
    },
    splitButton: Boolean,
    disabled: Boolean,
    flyweight: {
      type: Boolean,
      default: false
    },
    hideOnClick: {
      type: Boolean,
      default: true
    },
    hideOnScroll: Boolean,
    placement: {
      type: String,
      default: DropdownPlacements.bottomStart,
      validator: (value) => Object.values(DropdownPlacements).indexOf(value) > -1
    },
    visibleArrow: Boolean,
    search: Boolean,
    showTimeout: {
      type: Number,
      default: 0
    },
    hideTimeout: {
      type: Number,
      default: 0
    },
    // Internal use for different style in sidebar
    isSidebar: {
      type: Boolean,
      default: false
    }
  },

  emits: ['visible-change', 'command', 'click'],

  data() {
    return {
      timeout: null,
      visible: false,
      triggerElm: null,
      menuItems: null,
      menuItemsArray: null,
      currentItem: '',
      dropdownElm: null,
      previousScrollTop: 0
    };
  },

  computed: {
    listId() {
      return `dropdown-menu-${generateId()}`;
    },
    computedType() {
      return ['text'].includes(this.type) ? 'text' : this.type;
    }
  },

  watch: {
    visible(val) {
      if (this.flyweight) {
        this.$nextTick(() => {
          eventBus.$emit('el.dropdown.menu.visible', val);

          // this.broadcast('ElDropdownMenu', 'visible', val);
        });
      } else {
        eventBus.$emit('el.dropdown.menu.visible', val);

        // this.broadcast('ElDropdownMenu', 'visible', val);
      }
      this.$emit('visible-change', val);
      if (val && this.splitButton) {
        this.$refs.icon.$el.style.transform = 'rotate(180deg)';
      } else if (this.splitButton) {
        this.$refs.icon.$el.style.transform = '';
      }

      // add .is-selected class to the root element of slot of trigger element, support old slot syntax
      // To deprecate after vue 3.0
      this.$slots.default?.().forEach((vnode) => {
        if (vnode.elm?.classList) {
          if (val) {
            vnode.elm.classList.add('is-selected');
          }
          if (!val) {
            vnode.elm.classList.remove('is-selected');
          }
        }
      });
    }
  },

  async mounted() {
    eventBus.$on('el.dropdown.menu.item.click', this.handleMenuItemClick);
    eventBus.$on('onHidePopper', this.hide);

    await nextTick();
    this.initTriggerElement();
    this.initTriggerEvent();
    this.initTriggerAria();
  },

  methods: {
    show() {
      if (!this.popperElm && !this.flyweight) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.visible = true;
        this.$nextTick(() => {
          const scrollWrap = this.popperElm.querySelector('.el-select-dropdown__wrap');
          if (scrollWrap !== null && this.previousScrollTop > 0) {
            scrollWrap.scrollTop = this.previousScrollTop;
          }
        });
      }, this.showTimeout);
    },
    hide() {
      if (!this.popperElm && !this.flyweight) return;
      if (!this.visible) {
        return;
      }

      this.removeTabindex();
      this.resetTabindex(this.triggerElm);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const scrollWrap = this.popperElm.querySelector('.el-select-dropdown__wrap');
        if (scrollWrap !== null) {
          this.previousScrollTop = scrollWrap.scrollTop;
        }
        this.visible = false;
      }, this.hideTimeout);
    },
    handleClick() {
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
    },
    handleTriggerKeyDown(ev) {
      const keyCode = ev.keyCode;
      if (keyCode === 13) { // enter
        this.handleClick();
      } else if ([9, 27].indexOf(keyCode) > -1) { // tab || esc
        this.hide();
      }
      this.handleItemKeyDown(ev);
    },
    handleItemKeyDown(ev) {
      if (!this.menuItemsArray) return;
      const keyCode = ev.keyCode;
      const target = ev.target;
      const currentIndex = this.menuItemsArray.indexOf(target);
      const max = this.menuItemsArray.length - 1;
      let nextIndex = currentIndex;
      if ([38, 40].indexOf(keyCode) > -1) { // up/down
        if (keyCode === 38) { // up
          for (let i = currentIndex; i > 0; i--) {
            nextIndex--;
            if (this.menuItemsArray[nextIndex].style.display === 'none') {
              continue;
            }
            break;
          }
        } else { // down
          for (let i = currentIndex + 1; i <= max; ++i) {
            nextIndex++;
            if (this.menuItemsArray[nextIndex].style.display === 'none' && i !== max) {
              continue;
            }
            break;
          }
        }
        this.removeTabindex();
        this.resetTabindex(this.menuItems[nextIndex]);
        if (nextIndex !== -1) {
          this.menuItems[nextIndex].focus();
        }
        ev.preventDefault();
        ev.stopPropagation();
      } else if (keyCode === 13) { // enter
        this.currentItem = target.innerHTML.replace(/<(.*?)>/gm, '');
        target.click();
        if (this.hideOnClick) { // click
          this.triggerElm.focus();
          this.hide();
        }
      } else if ([9, 27].indexOf(keyCode) > -1) { // tab // esc
        this.hide();
        this.triggerElm.focus();
      }
    },
    resetTabindex(ele) {
      this.removeTabindex();
      ele && ele.setAttribute('tabindex', '0');
    },
    removeTabindex() {
      this.triggerElm.setAttribute('tabindex', '-1');
      this.menuItemsArray.forEach((item) => {
        item.setAttribute('tabindex', '-1');
      });
    },
    initTriggerAria() {
      this.triggerElm.setAttribute('aria-haspopup', 'list');
      this.triggerElm.setAttribute('aria-controls', this.listId);
      if (!this.splitButton) {
        this.triggerElm.setAttribute('role', 'button');
        this.triggerElm.setAttribute('tabindex', '0');
      }
    },
    initDropdownAria() {
      this.dropdownElm.setAttribute('id', this.listId);
    },
    initTriggerElement() {
      this.triggerElm = this.splitButton
        ? this.$refs.trigger.$el : this.$refs.trigger;

      if (this.splitButton && this.computedType === 'text') {
        this.triggerElm = this.$refs.group.$el;
      }
    },
    initTriggerEvent() {
      const {
        trigger, show, hide, handleClick, handleTriggerKeyDown
      } = this;
      this.triggerElm.addEventListener('keydown', handleTriggerKeyDown); // triggerElm keydown
      if (trigger === 'hover') {
        this.triggerElm.addEventListener('mouseenter', show);
        this.triggerElm.addEventListener('mouseleave', hide);
      } else {
        this.triggerElm.addEventListener('click', handleClick);
      }
    },
    initDropdownEvent() {
      const {
        trigger, show, hide, handleItemKeyDown
      } = this;

      this.dropdownElm.addEventListener('keydown', handleItemKeyDown, true); // item keydown
      if (trigger === 'hover') {
        this.dropdownElm.addEventListener('mouseenter', show);
        this.dropdownElm.addEventListener('mouseleave', hide);
      }
    },
    handleMenuItemClick(command, instance) {
      if (this.hideOnClick) {
        this.handleClick();
      }
      this.$emit('command', command, instance);
    },
    initDomOperation() {
      this.dropdownElm = this.popperElm;
      this.menuItems = this.dropdownElm.querySelectorAll('[tabindex=\'-1\']');
      this.menuItemsArray = [].slice.call(this.menuItems);
      this.initDropdownEvent();
      this.initDropdownAria();
    }
  },

  render() {
    const {
      splitButton,
      disabled,
      hide,
      computedType
    } = this;

    const handleMainButtonClick = (event) => {
      this.$emit('click', event);
      hide();
    };

    let triggerElm = [];
    if (splitButton) {
      triggerElm = (
          <el-split-button
            class={{
              'el-dropdown__text-split-button': computedType === 'text',
              'el-dropdown__text-split-button--dropdown-visible': computedType === 'text' && this.visible
            }}
            ref="group">
            <el-button
              type={ computedType }
              nativeOn-click={ handleMainButtonClick }
              tabindex={ computedType === 'text' ? -1 : 0 }
              class='el-dropdown__split-left'
              disabled={disabled}>
              {this.$slots.default?.()}
            </el-button>
            <span class="el-dropdown__divider"></span>
            <el-button
              ref="trigger"
              type={ computedType }
              tabindex={ computedType === 'text' ? -1 : 0 }
              class={{
                'el-dropdown__split-right': true,
                'is-selected': this.visible
              }}
              disabled={ disabled }>
              <el-icon ref="icon" name="i-chevron-down--16"/>
            </el-button>
          </el-split-button>
      );
    } else {
      triggerElm = (<div ref="trigger" class={{
        'is-selected': this.visible
      }}>
          {this.$slots.default?.()}
        </div>);

      // triggerElm.forEach((vnode) => {
      //   vnode.data = vnode.data || {};
      //   vnode.data.class = vnode.data.class || {};
      //   vnode.data.class['is-selected'] = this.visible;
      // });
    }

    let containerClass = 'el-dropdown qa-dropdown';
    if (disabled) {
      containerClass += ' is-disabled';
    }

    const shouldRenderDropdown = !this.flyweight || this.visible;

    return (
        <div class={containerClass} v-clickoutside={hide}>
          {triggerElm}
          {shouldRenderDropdown && this.$slots.dropdown?.()}
        </div>
    );
  }
};
</script>
