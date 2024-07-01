import type { Ref } from 'vue';
import { computed, nextTick, ref, watch } from 'vue';
import type { FittedAction, FittedItem } from './fittedActions.ts';

export default function useFittedActions({
  actions,
  item,
  resizableContainer,
  showDropdown,
  elementRefs
}: {
  actions: Ref<FittedAction[]>
  item?: Ref<FittedItem | undefined>
  resizableContainer: Ref<HTMLElement | null>
  showDropdown: Ref<boolean>
  elementRefs: Ref<(HTMLElement[] | null)>
}) {
  const elements = ref([] as FittedAction[]);

  const displayedActions = computed(() => {
    return elements.value?.filter(it => isDisplayed(it)) || [];
  });

  const dropdownActions = computed(() => {
    return displayedActions.value.filter(el => el.isInDropdown);
  });

  const visibleActions = computed(() => {
    return displayedActions.value.filter(el => !el?.isInDropdown);
  });

  function isDisplayed(action: FittedAction) {
    if (typeof action.display === 'function') {
      return action.display(item?.value);
    }
    if (typeof action.display === 'undefined') {
      return true;
    }

    return !!action.display;
  }

  async function calculateVisibility() {
    // wait while tracing elements are rendering
    await nextTick();

    if (!resizableContainer.value) {
      return;
    }

    let showNextElement = true;
    const DROPDOWN_WIDTH = showDropdown ? 40 : 0;
    const fullWidth = resizableContainer.value?.offsetWidth - DROPDOWN_WIDTH;
    let remainingWidth = 0;

    elementRefs.value?.forEach((element: HTMLElement, index) => {
      if (showNextElement && element.offsetWidth) {
        remainingWidth += element.offsetWidth;

        const isInDropdown = remainingWidth >= fullWidth;
        showNextElement = !isInDropdown;
        elements.value[index].isInDropdown = isInDropdown;
      }
      else {
        elements.value[index].isInDropdown = true;
      }
    });
  }

  watch(() => actions, async (newActions: Ref<FittedAction[]>) => {
    elements.value = newActions.value?.map((action: FittedAction) => {
      const name = action.name || action.title.split(' ').join('_').toLowerCase();

      return { id: '', title: '', ...item, name };
    });

    await calculateVisibility();
  }, { immediate: true });

  watch(displayedActions, () => {
    calculateVisibility();
  });

  return {
    elements,
    visibleActions,
    dropdownActions
  };
}
