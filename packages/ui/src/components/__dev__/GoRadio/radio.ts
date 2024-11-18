import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';

export type RadioOption = any;

interface GroupProvide {
  props: GroupProps
  emit: GroupEmit
}

export interface GroupEmit {
  (e: 'update:model-value', value: RadioOption): void
  (e: 'blur', event: FocusEvent): void
}

export interface GroupProps {
  modelValue?: RadioOption
  name: string
  disabled: boolean
  wide: boolean
}

const key: InjectionKey<GroupProvide> = Symbol('radioGroup');

export function provideRadioGroup(props: GroupProps, emit: GroupEmit) {
  provide(key, { props, emit });
}

export function useRadioGroup() {
  return inject(key)!;
}
