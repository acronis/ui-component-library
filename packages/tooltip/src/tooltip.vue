<template>
  <div
    ref="tooltipContainer"
    class="el-tooltip__container"
  >
    <Transition
      :name="transition"
    >
      <div
        :on-mouseenter="show"
        :on-mouseleave="hide"
        ref="tooltip"
        role="tooltip"
        :aria-hidden="(disabled || !showPopper) ? 'true': 'false'"
        v-show="!disabled && showPopper"
        :class="[
          'el-tooltip__popper',
          'qa-tooltip-popper',
          'el-popper',
          popperClass,
          {'el-tooltip__popper--auto-width': maxWidth === 'auto-width'}
        ]"
        :style="styles"
      >
      <slot name="content">
        {{ content }}
      </slot>
      <template v-if="visibleArrow">
        <div class="el-popper__arrow el-popper--with-arrow" x-arrow>
        </div>
      </template>
    </div>
    </Transition>
    <div
      ref="reference"
      class="reference"
      @keyup.esc="closePopper"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, onMounted } from 'vue';
import { createPopper } from '@popperjs/core';
import { debounce } from 'throttle-debounce';

const tooltipContainer = ref(null);
const popperInstance = ref(null);
const reference = ref(null);
const tooltip = ref(null);
const showPopper = ref(false);

const props = defineProps({
  trigger: {
    type: String,
    default: 'hover',
    validator(value) {
      return [
        'hover',
        'click',
      ].includes(value);
    },
  },
  openDelay: {
    type: Number,
    default: 500
  },
  closeDelay: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  manual: Boolean,
  popperClass: String,
  content: {
    type: String,
    default: null,
  },
  visibleArrow: {
    type: Boolean,
    default: true
  },
  transition: {
    type: String,
    default: 'el-fade-in-linear'
  },
  enterable: { type: Boolean, default: true },
  placement: {
    type: String,
    default: 'top',
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
  maxWidth: {
    type: [Number, String],
    default: 'default',
    validator(value) {
      const type = typeof value;
      return (type === 'number' && value > 0)
        || (type === 'string' && ['default', 'auto-width'].includes(value));
    }
  }
});

const styles = typeof props.maxWidth === 'number' ? { maxWidth: `${props.maxWidth}px` } : {};

const {
  content,
  disabled,
  openDelay,
  closeDelay,
  placement,
  maxWidth,
  popperClass,
  transition
} = toRefs(props);

function show () {
  tooltip.value.setAttribute('data-show', '');
  popperInstance.value.setOptions((options) => {
    return {
      ...options,
      modifiers: [
        ...options.modifiers,
        { name: 'eventListeners', enabled: true },
      ],
    };
  });
  popperInstance.value.update();
}

function hide () {
  tooltip.value.removeAttribute('data-show');
  // Disable the event listeners
  popperInstance.value.setOptions((options) => ({
    ...options,
    modifiers: [
      ...options.modifiers,
      { name: 'eventListeners', enabled: false },
    ],
  }));
}

const openPopperDebounce = debounce(openDelay.value, show);
const closePopperDebounce = debounce(closeDelay.value, hide);

const showEvents = ['mouseenter', 'focus', 'click'];
const hideEvents = ['mouseleave', 'blur'];
onMounted(() => {
  showEvents.forEach((event) => {
    const element = reference.value;
    element.addEventListener(event, openPopperDebounce);
  });

  hideEvents.forEach((event) => {
    const element = reference.value;
    element.addEventListener(event, closePopperDebounce);
  });

  popperInstance.value = createPopper(reference.value, tooltip.value, {
    placement: placement.value,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8]
        }
      }
    ]
  });
});
</script>
