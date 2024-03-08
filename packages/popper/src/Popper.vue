<template>
  <div
    ref="popperContainerNode"
    class="el-popper"
    :style="interactiveStyle"
    @mouseleave="hover && closePopper()"
  >
    <div
      ref="triggerNode"
      @mouseover="hover && openPopper()"
      @click="togglePopper"
      @focus="openPopper"
      @keyup.esc="closePopper"
    >
      <!-- The default slot to trigger the popper  -->
      <slot />
    </div>
    <Transition name="fade">
      <div
        v-show="shouldShowPopper"
        ref="popperNode"
        class="el-popper__node"
        @click="!interactive && closePopper()"
      >
        <slot
          name="content"
          :close="close"
          :is-open="modifiedIsOpen"
        >
          {{ content }}
        </slot>
        <Arrow v-if="arrow" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  defineProps,
  useSlots,
  toRefs,
  watch,
  watchEffect,
  onMounted,
} from 'vue';

import { debounce } from 'throttle-debounce';

import Arrow from './Arrow.vue';
import { usePopper, useContent, useClickAway } from './composables';

const emit = defineEmits(['open:popper', 'close:popper']);
const slots = useSlots();
const props = defineProps({
  /**
     * Preferred placement (the "auto" placements will choose the side with most space.)
     */
  placement: {
    type: String,
    default: 'bottom',
    validator(value) {
      return [
        'auto',
        'auto-start',
        'auto-end',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end',
      ].includes(value);
    },
  },
  /**
     * Disables automatically closing the popover when the user clicks away from it
     */
  disableClickAway: {
    type: Boolean,
    default: false,
  },
  /**
     * Offset in pixels along the trigger element
     */
  offsetSkid: {
    type: String,
    default: '0',
  },
  /**
     * Offset in pixels away from the trigger element
     */
  offsetDistance: {
    type: String,
    default: '12',
  },
  /**
     * Trigger the popper on hover
     */
  hover: {
    type: Boolean,
    default: false,
  },
  /**
     * Manually open/close the Popper, other events are ignored if this prop is set
     */
  show: {
    type: Boolean,
    default: null,
  },
  /**
     * Disables the Popper. If it was already open, it will be closed.
     */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
     * Open the Popper after a delay (ms).
     */
  openDelay: {
    type: [Number, String],
    default: 0,
  },
  /**
     * Close the Popper after a delay (ms).
     */
  closeDelay: {
    type: [Number, String],
    default: 0,
  },
  /**
     * The z-index of the Popper.
     */
  zIndex: {
    type: [Number, String],
    default: 9999,
  },
  /**
     * Display an arrow on the popper
     */
  arrow: {
    type: Boolean,
    default: false,
  },
  /**
     * Stop arrow from reaching the edge of the popper
     */
  arrowPadding: {
    type: String,
    default: '0',
  },
  /**
     * If the Popper should be interactive, it will close when clicked/hovered if false
     */
  interactive: {
    type: Boolean,
    default: true,
  },
  /**
     * Lock the Popper into place, it will not flip dynamically when it runs out of space if true
     */
  locked: {
    type: Boolean,
    default: false,
  },
  /**
     * If the content is just a simple string, it can be passed in as a prop
     */
  content: {
    type: String,
    default: null,
  },
});

const popperContainerNode = ref(null);
const popperNode = ref(null);
const triggerNode = ref(null);
const modifiedIsOpen = ref(false);

onMounted(() => {
  const children = slots.default();

  if (children && children.length > 1) {
    return console.error(
      `[Popper]: The <Popper> component expects only one child element at its root. You passed ${children.length} child nodes.`,
    );
  }
});

const {
  arrowPadding,
  closeDelay,
  content,
  disableClickAway,
  disabled,
  interactive,
  locked,
  offsetDistance,
  offsetSkid,
  openDelay,
  placement,
  show,
} = toRefs(props);

const { isOpen, open, close } = usePopper({
  arrowPadding,
  emit,
  locked,
  offsetDistance,
  offsetSkid,
  placement,
  popperNode,
  triggerNode,
});

const { hasContent } = useContent(slots, popperNode, content);

const manualMode = computed(() => show.value !== null);
const invalid = computed(() => disabled.value || !hasContent.value);
const shouldShowPopper = computed(() => isOpen.value && !invalid.value);
const enableClickAway = computed(
  () => !disableClickAway.value && !manualMode.value,
);
  // Add an invisible border to keep the Popper open when hovering from the trigger into it
const interactiveStyle = computed(() => (interactive.value
  ? `border: ${offsetDistance.value}px solid transparent; margin: -${offsetDistance.value}px;`
  : null),);

const openPopperDebounce = debounce(openDelay.value, open);
const closePopperDebounce = debounce(closeDelay.value, close);

const openPopper = async () => {
  if (invalid.value || manualMode.value) {
    return;
  }

  closePopperDebounce.flush();
  openPopperDebounce();
};

const closePopper = async () => {
  if (manualMode.value) {
    return;
  }

  openPopperDebounce.flush();
  closePopperDebounce();
};

const togglePopper = () => {
  isOpen.value ? closePopper() : openPopper();
};

/**
   * If Popper is open, we automatically close it if it becomes
   * disabled or without content.
   */
watch([hasContent, disabled], ([hasContent, disabled]) => {
  if (isOpen.value && (!hasContent || disabled)) {
    close();
  }
});

/**
   * In order to eliminate flickering or visibly empty Poppers due to
   * the transition when using the isOpen slot property, we need to return a
   * separate debounced value based on isOpen.
   */
watch(isOpen, (isOpen) => {
  if (isOpen) {
    modifiedIsOpen.value = true;
  } else {
    debounce(() => {
      modifiedIsOpen.value = false;
    }, 200);
  }
});

/**
   * Watch for manual mode.
   */
watchEffect(() => {
  if (manualMode.value) {
    show.value ? openPopperDebounce() : closePopperDebounce();
  }
});

/**
   * Use click away if it should be enabled.
   */
watchEffect(() => {
  if (enableClickAway.value) {
    useClickAway(popperContainerNode, closePopper);
  }
});
</script>

<style lang="scss" scoped>
  :root {
    --el-popper-theme-background-color: #fff;
    --el-popper-theme-background-color-hover: #fff;
    --el-popper-theme-text-color: #333;
    --el-popper-theme-border-width: 1px;
    --el-popper-theme-border-style: solid;
    --el-popper-theme-border-color: #dadada;
    --el-popper-theme-border-radius: 6px;
    --el-popper-theme-padding: 32px;
    --el-popper-theme-box-shadow: 0 6px 30px -6px rgb(0 0 0 / 25%);
  }

  .el-popper {
    display: inline-block;
  }

  .el-popper__node {
    transition: background 250ms ease-in-out;
    background: var(--el-popper-theme-background-color);
    padding: var(--el-popper-theme-padding);
    color: var(--el-popper-theme-text-color);
    border-radius: var(--el-popper-theme-border-radius);
    border-width: var(--el-popper-theme-border-width);
    border-style: var(--el-popper-theme-border-style);
    border-color: var(--el-popper-theme-border-color);
    box-shadow: var(--el-popper-theme-box-shadow);
    z-index: v-bind(zIndex);
  }

  .el-popper__node:hover,
  .el-popper__node:hover > #arrow::before {
    background: var(--el-popper-theme-background-color-hover);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
