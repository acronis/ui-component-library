import type { AcvFittedAction, AcvFittedItem } from '@/components/fitted-actions/fittedActions.ts';
import type { Ref } from 'vue';
import { computed, nextTick, ref, watch } from 'vue';

export default function useFittedActions({
  actions,
  item,
  resizableContainer,
  showDropdown,
  elementRefs
}: {
  actions: Ref<AcvFittedAction[]>
  item?: Ref<AcvFittedItem | undefined>
  resizableContainer: Ref<HTMLElement | null>
  showDropdown: Ref<boolean>
  elementRefs: Ref<(HTMLElement[] | null)>
}) {
  const elements = ref([] as AcvFittedAction[]);

  const displayedActions = computed(() => {
    return elements.value?.filter(it => isDisplayed(it)) || [];
  });

  const dropdownActions = computed(() => {
    return displayedActions.value.filter(el => el.isInDropdown);
  });

  const visibleActions = computed(() => {
    return displayedActions.value.filter(el => !el?.isInDropdown);
  });

  function isDisplayed(action: AcvFittedAction) {
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

  watch(() => actions, async (newActions: Ref<AcvFittedAction[]>) => {
    elements.value = newActions.value?.map((action: AcvFittedAction) => {
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
