import { shallowRef, isVNode } from 'vue';
import type {
  ComponentInternalInstance, VNode, VNodeChild, VNodeNormalizedChildren
} from 'vue';

// eslint-disable-next-line vue/prefer-import-from-vue
import { isArray } from '@vue/shared';

export type VNodeChildAtom = Exclude<VNodeChild, Array<any>>
export type RawSlots = Exclude<
    VNodeNormalizedChildren,
    Array<any> | null | string
>
export type FlattenVNodes = Array<VNodeChildAtom | RawSlots>

export const flattedChildren = (
  children: FlattenVNodes | VNode | VNodeNormalizedChildren
): FlattenVNodes => {
  const vNodes = isArray(children) ? children : [children];
  const result: FlattenVNodes = [];

  vNodes.forEach((child) => {
    if (isArray(child)) {
      result.push(...flattedChildren(child));
    } else if (isVNode(child) && isArray(child.children)) {
      result.push(...flattedChildren(child.children));
    } else {
      result.push(child);
      if (isVNode(child) && child.component?.subTree) {
        result.push(...flattedChildren(child.component.subTree));
      }
    }
  });
  return result;
};

const getOrderedChildren = <T>(
  vm: ComponentInternalInstance,
  childComponentName: string,
  children: Record<number, T>
): T[] => {
  const nodes = flattedChildren(vm.subTree).filter(
    (n): n is VNode => isVNode(n)
            && (n.type as any)?.name === childComponentName
            && !!n.component
  );
  const uids = nodes.map((n) => n.component!.uid);
  return uids.map((uid) => children[uid]).filter((p) => !!p);
};

export const useOrderedChildren = <T extends { uid: number }>(
  vm: ComponentInternalInstance,
  childComponentName: string
) => {
  const children: Record<number, T> = {};
  const orderedChildren = shallowRef<T[]>([]);

  const addChild = (child: T) => {
    children[child.uid] = child;
    orderedChildren.value = getOrderedChildren(vm, childComponentName, children);
  };
  const removeChild = (uid: number) => {
    delete children[uid];
    orderedChildren.value = orderedChildren.value.filter(
      // eslint-disable-next-line no-shadow
      (children) => children.uid !== uid
    );
  };

  return {
    children: orderedChildren,
    addChild,
    removeChild,
  };
};
