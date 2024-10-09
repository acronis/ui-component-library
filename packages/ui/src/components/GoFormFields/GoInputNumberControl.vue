<script lang="ts" setup>
  import type { RuleExpression } from '@/composables';
  import type { GoInputNumberProps, InputExpose } from '../GoInput/input';
  import GoFormControl from '@/components/GoForm/GoFormControl.vue';
  import GoInputNumber from '@/components/GoInput/GoInputNumber.vue';
  import { useGoField } from '@/composables';
  import { getUniqueIndex, omit } from '@acronis-platform/utils';
  import { computed, mergeProps, ref } from 'vue';
  import { getInputExpose } from '../GoInput/input';

  type GoInputNumberControlProps = GoInputNumberProps & {
    name: string
    label?: string
    rules?: RuleExpression<number>
  };

  const props = withDefaults(defineProps<GoInputNumberControlProps>(), {
    error: true,
  });

  const goInputRef = ref<InputExpose | null>(null);
  const inputProps = computed(() => omit(props, ['rules', 'label']));
  const { errorMessage, handleChange, value } = useGoField<number>(props.name, props.rules);
  const uniqueId = computed(() => `input_number_${getUniqueIndex()}`);

  defineExpose(getInputExpose(goInputRef));
</script>

<template>
  <GoFormControl
    :label="label"
    :label-for="uniqueId"
    :error-message="errorMessage"
    :error="error"
  >
    <GoInputNumber
      v-bind="mergeProps($attrs, inputProps)"
      :id="uniqueId"
      ref="goInputRef"
      :model-value="value"
      :error="!!errorMessage"
      @update:model-value="handleChange"
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
    </GoInputNumber>
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
