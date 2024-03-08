<template>
  <div ref="tabsRoot" class="el-tabs">
    <slot name="tab-nav" :panes="tabs" :tab-click="handleTabClick">
      <el-tab-nav
        ref="nav"
        :panes="tabs"
        :large="large"
        :no-margin="noMargin"
        @tab-click="handleTabClick"
      />
    </slot>
    <div class="el-tabs__content">
      <el-divider v-if="!noDivider" class="mt-24"/>
      <slot />
    </div>
  </div>
</template>

<script>
import {
  ref,
  provide,
  onMounted, watch, getCurrentInstance
} from 'vue';

import ElDivider from 'packages/divider';
import { useOrderedChildren } from './utils';

import ElTabNav from 'packages/tab-nav';

export default {
  name: 'ElTabs',

  components: {
    ElDivider,
    ElTabNav
  },

  props: {
    large: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [String, Number],
    },
    noDivider: {
      type: Boolean,
      default: false
    },
    noMargin: {
      type: Boolean,
      default: false
    }
  },

  emits: ['input', 'tab-click', 'update:modelValue'],

  setup(props, { slots, emit }) {
    const nav = ref(null);
    // const tabs = ref([]);
    // let registerPane = () => false;
    const currentTabKey = ref(props.modelValue);

    const {
      children: tabs,
      addChild: registerPane,
      removeChild: unregisterPane,
    } = useOrderedChildren(getCurrentInstance(), 'ElTabPane');

    const setCurrentTab = (tabKey) => {
      const currentTabIsRendered = tabs.value.find?.((tab) => tab.key === tabKey);

      if (currentTabIsRendered) {
        currentTabKey.value = tabKey;
      } else if (!currentTabIsRendered && tabs.value[0]) {
        currentTabKey.value = tabs.value[0]?.key;
      }

      nav.value?.reFocus();
    };

    const setTabs = () => {
      // tabs.value = slots.default()
      //   .filter((tab) => tab.type.name === 'ElTabPane' && tab.props)
      //   .map((tab, index) => ({
      //     key: tab.props.name || index,
      //     title: tab.props.label,
      //     icon: tab.props.icon,
      //     disabled: tab.props.disabled,
      //     slots: null,
      //   }));

      setCurrentTab(currentTabKey?.value || tabs.value[0]?.key);
    };

    const handleTabClick = (tab, tabName, event) => {
      if (tab.disabled) return;
      emit('update:modelValue', tabName);
      emit('tab-click', tab, event);
    };

    onMounted(() => {
      setTabs();
    });

    watch(() => slots.default(), async () => {
      setTabs();
    });

    watch(() => props.modelValue, (newValue) => {
      setCurrentTab(newValue);
    });

    provide('currentTabKey', currentTabKey);
    provide('registerPane', registerPane);
    provide('unregisterPane', unregisterPane);

    return {
      tabs, nav, currentTabKey, handleTabClick
    };
  }
};
</script>
