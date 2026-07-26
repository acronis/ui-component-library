<script>
  import TabLabel from './tab-label.vue';

  export default {
    name: 'TabNav',
    components: { TabLabel },

    props: {
      tabs: Array,
      currentIndex: Number,
      large: {
        type: Boolean,
        default: false
      },
      onTabClick: {
        type: Function
      },
      spacing: {
        type: Boolean,
        default: true
      }
    },
    emits: ['tabClick'],

    data() {
      return {
        isFocus: false,
        isMousedown: false
      };
    },

    methods: {
      changeTab(e) {
        const { keyCode } = e;
        let nextIndex;
        const { currentIndex } = this;
        let tabList;
        if ([37, 38, 39, 40].includes(keyCode)) {
          tabList = e.currentTarget.querySelectorAll('[role=tab]');
        }
        else {
          return;
        }
        if (keyCode === 37 || keyCode === 38) { // left
          if (currentIndex === 0) { // first
            nextIndex = tabList.length - 1;
          }
          else {
            nextIndex = currentIndex - 1;
          }
        }
        else { // right
          if (currentIndex < tabList.length - 1) { // not last
            nextIndex = currentIndex + 1;
          }
          else {
            nextIndex = 0;
          }
        }
        tabList[nextIndex].focus();
        tabList[nextIndex].click();
        this.removeFocus();
      },
      reFocus() {
        // const currentTab = this.$refs.tabs.find(x => x.id === `tab-${this.currentIndex}`);
        // if (currentTab && currentTab !== document.activeElement) {
        //   currentTab.focus();
        //   nextTick(this.removeFocus);
        // }
      },
      setFocus() {
        if (!this.isMousedown) {
          this.isFocus = true;
        }
      },
      removeFocus() {
        this.isFocus = false;
      }
    }
  };
</script>

<template>
  <div
    class="acv-tabs__nav"
    :class="{
      'acv-tabs__nav--large': large,
      'acv-tabs__nav--spaced': spacing,
    }"
    role="tablist"
    @keydown="changeTab"
  >
    <button
      v-for="(tab, index) in tabs"
      :id="`tab-${tab.name || tab.index || index}`"
      :key="tab.name || tab.index || index"
      type="button"
      class="acv-tabs__item"
      :class="{
        'is-active': currentIndex === index,
        'is-disabled': tab.disabled,
        'is-focus': isFocus && !tab.disabled,
      }"
      :aria-controls="`pane-${tab.name || tab.index || index}`"
      role="tab"
      :aria-selected="tab.active"
      @focus="setFocus"
      @blur="removeFocus"
      @mousedown="isMousedown = true"
      @mouseup="isMousedown = false"
      @click="!tab.disabled && $emit('tabClick', index, tab.props.name)"
    >
      <TabLabel
        :label="tab.children?.label?.() || tab.props.label"
        :icon="tab.children?.icon?.() || tab.props.icon"
      />
    </button>
  </div>
</template>

<style scoped>
.acv-tabs__nav {
  flex-wrap: nowrap;
  display: flex;
  border: var(--acv-border-small) var(--acv-color-primary);
  border-radius: var(--acv-border-radius-small);
  height: 32px;
  box-sizing: border-box;
  line-height: calc(var(--acv-font-line-height-medium) - (2 * var(--acv-border-width-small)));

  &.acv-tabs__nav--large {
    --acv-icon-size: var(--acv-icon-size-medium);
    height: 48px;
    line-height: calc(var(--acv-font-line-height-x-large) - (2 * var(--acv-border-width-small)));
  }

  &.acv-tabs__nav--spaced {
    margin: 24px 24px 0;
  }
}

.acv-tabs__item {
  padding: 0 16px;
  height: 100%;
  line-height: inherit;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: var(--acv-font-size-body);
  font-weight: var(--acv-font-weight-strong);
  color: var(--acv-color-primary);
  position: relative;
  border: 0;
  border-right: var(--acv-border-small)  var(--acv-color-primary);
  background-color: transparent;
  min-width: 0;
  outline: none;

  &.is-active {
    background-color: var(--acv-color-secondary-active, var(--acv-color-button-active-secondary));
  }

  &.is-disabled {
    color: var(--acv-color-primary-light);
    cursor: default;
  }

  &:-moz-focusring {
    outline: none;
  }

  &:last-child {
    border: 0;
    border-radius: 0 var(--acv-border-radius-regular) var(--acv-border-radius-regular) 0;
  }

  &:first-child {
    border-radius: var(--acv-border-radius-regular) 0 0 var(--acv-border-radius-regular);
  }

  &.is-focus:focus:not(:active) {
    outline: none;
    overflow: visible;

    &:before {
      content: '';
      border: var(--acv-border-width-large) var(--acv-border-style-solid) var(--acv-color-focus);
      border-width: 3px 0;
      position: absolute;
      inset: -4px 0;
      box-sizing: content-box;
    }

    &:first-child:before {
      border-width: var(--acv-border-width-large) 0 var(--acv-border-width-large) var(--acv-border-width-large);
      left: -4px;
      border-radius: var(--acv-border-radius-medium) 0 0 var(--acv-border-radius-medium);
    }

    &:last-child:before {
      border-width: var(--acv-border-width-large) var(--acv-border-width-large) var(--acv-border-width-large) 0;
      right: -4px;
      border-radius: 0 var(--acv-border-radius-medium) var(--acv-border-radius-medium) 0;
    }
  }

  &:hover {
    background-color: var(--acv-color-secondary-hover);
    cursor: pointer;
  }

  &:active {
    background-color: var(--acv-color-secondary-active, var(--acv-color-button-active-secondary));
  }
}
</style>
