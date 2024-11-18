<script lang="ts" setup>
  import type { GoInputNumberProps, InputExpose } from '@/components/__dev__/GoInput/input.ts';
  import type { RuleExpression } from '@/composables/index.ts';
  import GoFormControl from '@/components/__dev__/GoForm/GoFormControl.vue';
  import GoInputNumber from '@/components/__dev__/GoInput/GoInputNumber.vue';
  import { getInputExpose } from '@/components/__dev__/GoInput/input.ts';
  import { useGoField } from '@/composables/index.ts';
  import { getUniqueIndex, omit } from '@acronis-platform/utils';
  import { computed, mergeProps, ref } from 'vue';

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
