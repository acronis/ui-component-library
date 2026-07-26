<script lang="ts" setup>
  import type { RuleExpression } from '@/composables';
  import type { GoInputProps, InputExpose } from '../GoInput/input';
  import GoFormControl from '@/components/GoForm/GoFormControl.vue';
  import GoInput from '@/components/GoInput/GoInput.vue';
  import { useGoField } from '@/composables';
  import { getUniqueIndex, omit } from '@acronis-platform/utils';
  import { computed, mergeProps, ref } from 'vue';
  import { getInputExpose } from '../GoInput/input';

  type GoInputControlProps = GoInputProps & {
    name: string
    label?: string
    rules?: RuleExpression<string>
    hint?: string
    fixedWidth?: boolean
    optional?: boolean
  };

  defineOptions({ inheritAttrs: false });
  const props = withDefaults(defineProps<GoInputControlProps>(), {
    autosize: false,
    error: true,
  });
  const emit = defineEmits<{
    (e: 'update:model-value', value: string): void
    (e: 'blur'): void
    (e: 'keydown', event: KeyboardEvent): void
  }>();
  const goInputRef = ref<InputExpose | null>(null);
  const inputProps = computed(() =>
    omit(props, ['rules', 'hint', 'fixedWidth', 'optional', 'label']),
  );
  const { errorMessage, value, handleChange, handleBlur } = useGoField<string>(
    props.name,
    props.rules,
  );
  const uniqueId = computed(() => props.id || `input_${getUniqueIndex()}`);

  defineExpose(getInputExpose(goInputRef));

  function handleKeydown(event: KeyboardEvent) {
    return emit('keydown', event);
  }
</script>

<template>
  <GoFormControl
    :class="$props.class"
    :label="label"
    :hint="hint"
    :label-for="uniqueId"
    :error-message="errorMessage"
    :fixed-width="fixedWidth"
    :error="error"
    :optional="optional"
  >
    <GoInput
      v-bind="mergeProps($attrs, inputProps)"
      :id="uniqueId"
      ref="goInputRef"
      :model-value="value"
      :error="!!errorMessage"
      @update:model-value="handleChange"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
      <template
        v-if="$slots.prefix"
        #prefix
      >
        <slot name="prefix" />
      </template>
      <template
        v-if="$slots.suffix"
        #suffix
      >
        <slot name="suffix" />
      </template>
    </GoInput>
    <template
      v-if="$slots.addition"
      #addition
    >
      <slot name="addition" />
    </template>
    <template
      v-if="$slots.informer"
      #informer
    >
      <slot name="informer" />
    </template>
  </GoFormControl>
</template>

<style scoped></style>
