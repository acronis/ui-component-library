<script setup>
  import { removeElement } from '@/components/notification/utils';
  import eventBus from '@/utils/eventBus';
  import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, render } from 'vue';
  import { AcvNotificationPosition, AcvNotificationType } from './notification';
  import AcvNotification from './notification.vue';
  import Timer from './timer';

  const props = defineProps({
    message: {
      type: [String, Object],
      required: true
    },
    type: {
      type: String,
      default: AcvNotificationType.SUCCESS,
    },
    position: {
      type: String,
      default: AcvNotificationPosition.TOP_RIGHT,
      validator: value => Object.values(AcvNotificationPosition).includes(value)
    },
    duration: {
      type: Number,
      default: 3000
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    onDismiss: {
      type: Function,
      default: () => {
      }
    },
    onClick: {
      type: Function,
      default: () => {
      }
    },
    queue: Boolean,
    content: Object,
    pauseOnHover: {
      type: Boolean,
      default: true
    },
  });
  const isActive = ref(false);
  const parentTop = ref(null);
  const parentBottom = ref(null);
  const timer = ref(null);
  const root = ref(null);
  const queueTimer = ref(null);
  const parentElement = computed(() => {
    switch (props.position) {
      case AcvNotificationPosition.TOP:
      case AcvNotificationPosition.TOP_RIGHT:
      case AcvNotificationPosition.TOP_LEFT:
        return parentTop.value;

      case AcvNotificationPosition.BOTTOM:
      case AcvNotificationPosition.BOTTOM_RIGHT:
      case AcvNotificationPosition.BOTTOM_LEFT:
        return parentBottom.value;
    }

    return parentBottom.value;
  });
  const transition = computed(() => {
    switch (props.position) {
      case AcvNotificationPosition.TOP:
      case AcvNotificationPosition.TOP_RIGHT:
      case AcvNotificationPosition.TOP_LEFT:
        return {
          enter: 'acv-notify--fade-in-down',
          leave: 'acv-notify--fade-out'
        };

      case AcvNotificationPosition.BOTTOM:
      case AcvNotificationPosition.BOTTOM_RIGHT:
      case AcvNotificationPosition.BOTTOM_LEFT:
        return {
          enter: 'acv-notify--fade-in-up',
          leave: 'acv-notify--fade-out'
        };
    }

    return {
      enter: 'acv-notify--fade-in-up',
      leave: 'acv-notify--fade-out'
    };
  });

  onBeforeMount(() => {
    // console.log('onBeforeMount');
    createNotificationContainer();
  });

  onMounted(() => {
    showNotice();
    eventBus.$on('notify-clear', dismiss);
    document.addEventListener('keydown', keydown);
  });

  onBeforeUnmount(() => {
    eventBus.$off('notify-clear', dismiss);
    document.removeEventListener('keydown', keydown);
  });

  function createNotificationContainer() {
    parentTop.value = document.querySelector('.acv-notify.acv-notify--top');
    parentBottom.value = document.querySelector('.acv-notify.acv-notify--bottom');
    // No need to create them, they already exists
    if (parentTop.value && parentBottom)
      return;

    if (!parentTop.value) {
      parentTop.value = document.createElement('div');
      parentTop.value.className = 'acv-notify acv-notify--top';
    }

    if (!parentBottom.value) {
      parentBottom.value = document.createElement('div');
      parentBottom.value.className = 'acv-notify acv-notify--bottom';
    }

    const container = document.body;
    container.appendChild(parentTop.value);
    container.appendChild(parentBottom.value);
  }

  function shouldQueue() {
    if (!props.queue)
      return false;

    return (
      parentTop.value.childElementCount > 0
      || parentBottom.value.childElementCount > 0
    );
  }

  function dismiss(...args) {
    if (timer.value)
      timer.value.stop();
    clearTimeout(queueTimer.value);
    isActive.value = false;

    // Timeout for the animation complete before destroying
    setTimeout(() => {
      props.onDismiss.apply(...args);

      const wrapper = root.value;
      // unmount the component
      render(null, wrapper);
      removeElement(wrapper);
    }, 150);
  }

  /**
   * Displays the notification.
   * If the notification should be queued, it sets a timeout to call itself recursively.
   * Otherwise, it inserts the notification element into the DOM and starts the timer if a duration is specified.
   */
  function showNotice() {
    if (shouldQueue()) {
      // Call recursively if it should queue
      queueTimer.value = setTimeout(showNotice, 250);
      return;
    }
    const wrapper = root.value.parentElement;
    parentElement.value.insertAdjacentElement('afterbegin', root.value);
    // console.log(wrapper, parentElement.value);
    removeElement(wrapper);

    isActive.value = true;

    if (props.duration) {
      timer.value = new Timer(dismiss, props.duration);
    }
  }

  function handleClick(...args) {
    if (!props.dismissible)
      return;
    props.onClick(...args);
    dismiss();
  }

  function toggleTimer(newVal) {
    if (!props.pauseOnHover || !timer.value)
      return;
    newVal ? timer.value.pause() : timer.value.resume();
  }

  /**
   * Handles keydown events.
   * - Clears the timer if the Delete (46) or Backspace (8) key is pressed.
   * - Closes the notification if the Escape (27) key is pressed and the notification is not already closed.
   * - Starts the timer for any other key press.
   *
   * @param {KeyboardEvent} e - The keyboard event.
   */
  function keydown(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      toggleTimer(true);
    }
    else if (e.key === 'Escape') {
      if (isActive.value) {
        dismiss();
      }
    }
    else {
      toggleTimer(false);
    }
  }

  defineExpose({
    dismiss
  });
</script>

<template>
  <transition
    :enter-active-class="transition.enter"
    :leave-active-class="transition.leave"
  >
    <div
      v-show="isActive"
      ref="root"
      class="acv-notify__item"
      :class="[`acv-notify__item--${type}`, `acv-notify__item--${position}`]"
      @mouseover="toggleTimer(true)"
      @mouseleave="toggleTimer(false)"
      @click="handleClick"
    >
      <AcvNotification
        :visible="isActive"
        :type="type"
        :position="position"
        :message="message"
        @close="dismiss"
      >
        <template
          v-if="content"
          #content
        >
          <component :is="content" />
        </template>
      </AcvNotification>
    </div>
  </transition>
</template>

<style lang="scss" scoped>

</style>
