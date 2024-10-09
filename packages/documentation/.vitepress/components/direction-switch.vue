<script setup lang="ts">
  import { isClient } from '@acronis-platform/utils';
  import { onMounted, ref, watch } from 'vue';

  const emit = defineEmits(['change']);

  const rootCls = isClient ? document.documentElement.classList : undefined;
  const rtl = ref(false);

  watch(
    rtl,
    () => {
      emit('change', rtl.value);
    },
    { flush: 'post' }
  );

  onMounted(() => {
    rtl.value = !!rootCls && rootCls.contains('rtl');
  });

  function toggleRtl(value: boolean) {
    if (!isClient || !rootCls) {
      return;
    }

    requestAnimationFrame(() => {
      rtl.value = value;

      if (value) {
        rootCls.add('rtl');
        document.documentElement.dir = 'rtl';
      }
      else {
        rootCls.remove('rtl');
        document.documentElement.dir = 'ltr';
      }

      localStorage.setItem('uikit-docs-direction-prefer-rtl', String(value));
    });
  }
</script>

<template>
  <div
    class="direction-switch"
    role="switch"
    tabindex="0"
    @click="toggleRtl(!rtl)"
  >
    <Icon
      :icon="rtl ? AlignRight : AlignLeft"
      :scale="1.25"
    />
  </div>
</template>

<style scoped lang="css">
.direction-switch {
  display: inline-flex;
  cursor: pointer;
  outline: 0;
  transition: var(--acv-transition-color);

  &:hover,
  &:focus {
    color: var(--acv-color-primary);
  }
}
</style>
