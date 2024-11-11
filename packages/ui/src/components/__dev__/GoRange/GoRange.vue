<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';

  const props = withDefaults(
    defineProps<{
      min?: number
      max?: number
      modelValue?: number
      step?: number | 'any'
    }>(),
    {
      min: 0,
      max: 100,
      step: 1,
    },
  );
  const emit = defineEmits<{
    (e: 'update:model-value', value: number): void
  }>();
  const numberValue = ref(props.modelValue || props.min);

  // this fixedValue needs to prevent range change when user erase value in alongside input
  // this code holds previous position of range
  watchEffect(
    () =>
      typeof props.modelValue === 'number'
      && (numberValue.value = props.modelValue),
  );
  // const percent = computed(
  //   () => `${((numberValue.value - props.min) / (props.max - props.min)) * 100}%`,
  // );

  function onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    emit('update:model-value', Number.parseFloat(input.value));
  }
</script>

<template>
  <input
    class="go-range"
    type="range"
    :min="min"
    :max="max"
    :value="numberValue"
    :step="step"
    @input="onInput"
  >
</template>

<style scoped>
/*
@define-mixin range-thumb {
border: var(--base-range-thumb-border);
border-radius: 50%;
background: var(--base-range-thumb-background);
block-size: var(--base-range-thumb-size);
cursor: grab;
inline-size: var(--base-range-thumb-size);
opacity: var(--base-range-thumb-opacity);
transition: opacity var(--transition-shortest);

.go-range:active& {
  cursor: inherit;
}

.go-range:focus-visible& {
  border-width: 2px;
  outline: var(--outline);
  outline-offset: 2px;
}

&:hover {
  border-width: 2px;
  background: var(--base-range-thumb-background-hover);
}
}

@define-mixin range-track {
border: none;
appearance: none;
background: transparent;
block-size: var(--base-range-height);
box-shadow: none;
cursor: inherit;
inline-size: 100%;
}

.go-range {
box-sizing: content-box;
border: var(--base-range-border) solid transparent;
appearance: none;
background-clip: padding-box;
background-color: var(--base-range-background-color);
background-image: linear-gradient(var(--base-range-fill-color), var(--base-range-fill-color));
background-size: v-bind(percent) 100%;
block-size: var(--base-range-height);
border-inline-end-width: 0;
border-inline-start-width: 0;
color: var(--color-inverted-spot-primary);
cursor: pointer;
inline-size: 100%;

&:active {
  cursor: grabbing;
}

&:focus {
  outline: none;
}

&::-moz-range-track {
  @mixin range-track;
}

&::-webkit-slider-runnable-track {
  @mixin range-track;
}

&::-ms-track {
  @mixin range-track;
}

&::-webkit-slider-thumb {
  @mixin range-thumb;
  appearance: none;
  transform: translateY(calc(-50% + 1px));
}
    &::-moz-range-thumb {
          @mixin range-thumb;
   }

   &::-ms-thumb {
     @mixin range-thumb;
}
}

 */
</style>
