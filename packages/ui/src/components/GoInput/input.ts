import type { Ref } from 'vue';
import type { Mask } from './inputMasks';
import type { InputParser } from './inputParsers';

export interface GoInputProps {
  id?: string
  modelValue?: number | string
  placeholder?: string
  name?: string
  class?: string | unknown[] | object
  type?: string
  resize?: boolean
  disabled?: boolean
  autofocus?: boolean
  error?: boolean
  autosize?: boolean | Partial<InputAutosize>
  clearable?: boolean
  parsers?: InputParser | InputParser[]
  mask?: Mask
}

export type GoInputNumberProps = GoInputProps & {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  float?: boolean
  controls?: boolean
};

export interface InputAutosize {
  min: number
  max: number
}

export const INPUT_DEFAULT_AUTOSIZE: InputAutosize = {
  min: 1,
  max: 5,
};

export interface InputExpose {
  focus: () => void
  blur: () => void
  clear: () => void
  reset: () => void
}

export function getAutosize(props: boolean | Partial<InputAutosize>): InputAutosize {
  if (typeof props === 'boolean') {
    return INPUT_DEFAULT_AUTOSIZE;
  }

  return { ...INPUT_DEFAULT_AUTOSIZE, ...props };
}

export function getInputExpose(goInputRef: Ref<InputExpose | null>): InputExpose {
  return {
    focus: () => goInputRef.value?.focus(),
    blur: () => goInputRef.value?.blur(),
    clear: () => goInputRef.value?.clear(),
    reset: () => goInputRef.value?.reset(),
  };
}
