<script lang="ts" setup>
  import type { CheckboxModel, CheckboxOption } from './checkbox';
  import GoPick from '@/components/GoPick/GoPick.vue';
  // import CheckmarkForCheckboxSvg from '@constructor/icons/svg/ui-details/checkmark-for-checkbox.svg';
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<{
      modelValue?: CheckboxModel
      value?: CheckboxOption
      disabled?: boolean
    }>(),
    {
      modelValue: false,
    },
  );
  const emit = defineEmits<{
    (e: 'update:model-value', value: CheckboxModel): void
    // TODO: this is a dirty hack for typescript(?) issue
    // https://github.com/johnsoncodehk/volar/issues/1855
    (e: '__', value: CheckboxModel): void
    (e: 'blur', event: FocusEvent): void
  }>();
  const proxy = computed({
    get() {
      return props.modelValue;
    },
    set(value: CheckboxModel) {
      emit('update:model-value', value);
    },
  });
</script>

<template>
  <GoPick :disabled="disabled">
    <template #input>
      <input
        v-model="proxy"
        class="go-checkbox-input"
        :value="value"
        type="checkbox"
        :disabled="disabled"
        @blur="$emit('blur', $event)"
      >
    </template>
    <template #icon>
      <slot name="icon">
        <span class="go-checkbox-icon">
          <span class="content">
            <!--            <CheckmarkForCheckboxSvg /> -->
          </span>
        </span>
      </slot>
    </template>
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </GoPick>
</template>

<style scoped>
  .go-checkbox-icon {
    --checkbox-background-selected: currentColor;
    --checkbox-background-color: transparent;
    --icon-color: transparent;
    display: flex;
    border: 1px solid var(--checkbox-background-selected);
    margin: 1px; /* to make checkbox 16x16 */
    background-clip: padding-box;
    block-size: 14px;
    inline-size: 14px;
    transition: background-color var(--transition-shortest);
  }

  .go-checkbox-input:checked + * .go-checkbox-icon {
    --checkbox-background-color: var(--checkbox-background-selected);
    --icon-color: var(--color-glyph-inverted-primary);
  }

  .content {
    --icon-size: 100%;
    display: flex;
    background-color: var(--checkbox-background-color); /* needs for safari */
  }
</style>
