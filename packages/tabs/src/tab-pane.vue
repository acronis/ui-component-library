<template>
  <div
    v-show="active"
    :id="`pane-${name}`"
    class="el-tab-pane"
    role="tabpanel"
    :aria-hidden="!active"
    :aria-labelledby="`tab-${name}`"
  >
    <slot />
  </div>
</template>
<script>
import {
  computed, getCurrentInstance, inject, onMounted, onUnmounted, reactive
} from 'vue';

export default {
  name: 'ElTabPane',

  props: {
    label: String,
    icon: String,
    labelContent: Function,
    name: String,
    disabled: Boolean
  },

  setup(props) {
    const currentTabKey = inject('currentTabKey');
    const registerPane = inject('registerPane');
    const unregisterPane = inject('unregisterPane');
    const instance = getCurrentInstance();
    const pane = reactive({
      uid: instance.uid,
      key: props.name,
      title: props.label,
      icon: props.icon,
      disabled: props.disabled
    });

    onMounted(() => {
      registerPane(pane);
    });

    onUnmounted(() => {
      unregisterPane(pane.uid);
    });

    const active = computed(() => currentTabKey.value === props.name);

    return {
      ...props, active, currentTabKey
    };
  },

  watch: {
    label() {
      this.$parent.$forceUpdate();
    }
  }
};
</script>
