import { computed, ref } from 'vue';

interface ProxyVisibleProps {
  visible?: boolean
}

interface ProxyVisibleEmits {
  (e: 'update:visible', visible: boolean): void
}

/**
 * Use visible from props when its exist
 */
export function useProxyVisible(props: ProxyVisibleProps, emit: ProxyVisibleEmits) {
  const inlineVisible = ref(false);
  const isManual = computed(() => typeof props.visible === 'boolean');
  const proxyVisible = computed({
    get() {
      return isManual.value ? props.visible! : inlineVisible.value;
    },
    set(newValue: boolean) {
      if (isManual.value) {
        emit('update:visible', newValue);
        return;
      }

      inlineVisible.value = newValue;
    },
  });

  return { proxyVisible, isManual };
}
