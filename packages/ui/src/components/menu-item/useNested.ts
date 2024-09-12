import { type InjectionKey, type Ref, inject, provide, ref } from 'vue';

type AcvNestedInjection = Ref<any[]>;

const NESTED_KEY: InjectionKey<AcvNestedInjection> = Symbol('NESTED_KEY');

export function useNested() {
  const parentTree: AcvNestedInjection = inject(NESTED_KEY, ref([]));
  const tree = parentTree;
  const addToTree = (value: unknown) => {
    tree.value.push(value);
  };

  provide(NESTED_KEY, tree);

  return {
    tree,
    addToTree
  };
}
