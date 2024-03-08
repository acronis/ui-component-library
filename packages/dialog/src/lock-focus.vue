<template>
  <div>
    <div
      v-if="hasLeadingGuards"
      :tabIndex="guardsTabIndex"
      :style="hidden"
    />
    <div
      v-if="hasLeadingGuards"
      :tabIndex="guardsLeadingTabIndex"
      :style="hidden"
    />

    <div
      ref="lock"
      data-lock
      @focusout="onBlur"
    >
      <slot />
    </div>

    <div
      v-if="hasTailingGuards"
      :tabIndex="guardsTabIndex"
      :style="hidden"
    />
  </div>
</template>

<script>
import moveFocusInside, { focusInside, focusIsHidden } from 'focus-lock';

import eventBus from '@/utils/eventBus';

let currentPopperSet = [];
let lastActiveTrap = 0;
let lastActiveFocus = null;
let focusWasOutsideWindow = false;
let instances = [];

function deferAction(action) {
  const setImmediate = window.setImmediate;
  if (typeof setImmediate !== 'undefined') {
    setImmediate(action);
  } else {
    setTimeout(action, 1);
  }
}

const focusOnBody = () => (
  document?.activeElement === document?.body
);
const isFreeFocus = () => focusOnBody() || focusIsHidden();
const activateTrap = () => {
  let result = false;
  if (lastActiveTrap) {
    const { observed, onActivation } = lastActiveTrap;
    if (focusWasOutsideWindow || !isFreeFocus() || !lastActiveFocus) {
      const lastLockFocusEl = instances[instances.length - 1]?.vue?.$el;
      const isFocusIn = focusInside(observed)
        || currentPopperSet.some(focusInside)
        || focusInside(lastLockFocusEl)
        || currentPopperSet.length > 0;

      if (observed && !isFocusIn) {
        onActivation();
        result = moveFocusInside(observed, lastActiveFocus);
      }
      focusWasOutsideWindow = false;
      lastActiveFocus = document?.activeElement;
    }
  }
  return result;
};
const reducePropsToState = (propsList) => propsList
  .filter(({ disabled }) => !disabled)
  .slice(-1)[0];
const handleStateChangeOnClient = (trap) => {
  if (lastActiveTrap !== trap) {
    lastActiveTrap = null;
  }
  lastActiveTrap = trap;
  if (trap) {
    activateTrap();
    deferAction(activateTrap);
  }
};
const emitChange = () => {
  handleStateChangeOnClient(reducePropsToState(instances));
};
const onTrap = (event) => {
  if (activateTrap() && event) {
    // prevent scroll jump
    event.stopPropagation();
    event.preventDefault();
  }
};
const onBlur = () => {
  deferAction(activateTrap);
};
const onWindowBlur = () => {
  focusWasOutsideWindow = true;
};

const attachHandler = () => {
  document.addEventListener('focusin', onTrap, true);
  document.addEventListener('focusout', onBlur);
  window.addEventListener('blur', onWindowBlur);
};
const detachHandler = () => {
  document.removeEventListener('focusin', onTrap, true);
  document.removeEventListener('focusout', onBlur);
  window.removeEventListener('blur', onWindowBlur);
};

export default {
  name: 'LockFocus',
  props: {
    returnFocus: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    noFocusGuards: {
      type: [Boolean, String],
      default: false
    }
  },
  data() {
    return {
      data: {},
      poppers: [],
      hidden: ''//    "width: 1px;height: 0px;padding: 0;overflow: hidden;position: fixed;top: 0;left: 0;"
    };
  },
  computed: {
    hasLeadingGuards() {
      return this.noFocusGuards !== true;
    },
    hasTailingGuards() {
      return this.hasLeadingGuards && (this.noFocusGuards !== 'tail');
    },
    guardsTabIndex() {
      return this.disabled ? -1 : 0;
    },
    guardsLeadingTabIndex() {
      return this.disabled ? -1 : 1;
    }
  },
  watch: {
    disabled(disabled) {
      this.data.disabled = disabled;

      if (!disabled) {
        eventBus.$on('el.popper.created', this.onPopperCreate);
        eventBus.$on('el.popper.destroyed', this.onPopperDestroy);
      } else {
        eventBus.$off('el.popper.created', this.onPopperCreate);
        eventBus.$off('el.popper.destroyed', this.onPopperDestroy);
      }
      emitChange();
    }
  },
  mounted() {
    if (!this.disabled) {
      this.data.vue = this;
      this.data.observed = this.$el.querySelector('[data-lock]');
      this.data.disabled = this.disabled;
      this.data.onActivation = () => {
        this.originalFocusedElement = this.originalFocusedElement || document?.activeElement;
      };
      if (!instances.length) {
        attachHandler();
      }
      instances.push(this.data);

      currentPopperSet = this.poppers;

      eventBus.$on('el.popper.created', this.onPopperCreate);
      eventBus.$on('el.popper.destroyed', this.onPopperDestroy);
    }
  },
  unmounted() {
    instances = instances.filter(({ vue }) => vue !== this);
    if (!instances.length) {
      detachHandler();
    }
    if (
      this.returnFocus
        && this.originalFocusedElement?.focus
    ) {
      this.originalFocusedElement.focus();
    }
    emitChange();

    eventBus.$off('el.popper.created', this.onPopperCreate);
    eventBus.$off('el.popper.destroyed', this.onPopperDestroy);
  },
  methods: {
    onBlur() {
      deferAction(emitChange);
    },
    onPopperCreate(newPopper) {
      if (!this.poppers.some((popper) => popper === newPopper.$el)) {
        this.poppers.push(newPopper.$el);
      }
      currentPopperSet = this.poppers;
    },
    onPopperDestroy(destroyedPopper) {
      this.poppers = this.poppers.filter((popper) => popper !== destroyedPopper.$el);
      currentPopperSet = this.poppers;
    }
  }
};
</script>
