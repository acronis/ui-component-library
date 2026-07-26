import type { InjectionKey, Ref, Slots } from 'vue';
import { computed, inject, provide, shallowReactive } from 'vue';

type Select = ReturnType<typeof provideSelect>;

export type SelectModel = SelectOptionValue | SelectOptionValue[];
export type SelectOptionValue = any;

export interface SelectProps {
  disabled?: boolean
  error?: boolean
  /**
   * pass array if multiple=true
   */
  modelValue?: SelectModel
  multiple?: boolean
  visible?: boolean
  resettable?: boolean
  placeholder?: string
  // TODO: fix it
  position?: unknown
}

interface SelectSettings {
  multiple: Ref<boolean>
  onSelect: (value: SelectOptionValue) => void
  isSelected: (value: SelectOptionValue) => boolean
}

interface SelectOption {
  slots: Slots
  value: SelectOptionValue
}

const key: InjectionKey<Select> = Symbol('dropdown');

export function provideSelect(settings: SelectSettings) {
  const api = getSelect(settings);

  provide(key, api);

  return api;
}

export function injectSelect() {
  return inject(key)!;
}

function getSelect(settings: SelectSettings) {
  const options = shallowReactive(new Map<string, SelectOption>());
  const countOptions = computed(() => options.size);

  return {
    options,
    countOptions,
    setOption,
    setOptionValue,
    unsetOption,
    getSlotsByValue,
    ...settings,
  };

  function getSlotsByValue(value: SelectOptionValue) {
    for (const option of options.values()) {
      if (value === option.value) {
        return option.slots;
      }
    }
  }

  function setOption(id: string, option: SelectOption) {
    options.set(id, option);
  }

  function setOptionValue(id: string, value: SelectOption['value']) {
    setOption(id, { ...options.get(id)!, value });
  }

  function unsetOption(id: string) {
    options.delete(id);
  }
}
