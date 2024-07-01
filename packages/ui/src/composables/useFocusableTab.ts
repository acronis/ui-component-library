import type { Ref } from 'vue';
import { ref } from 'vue';

export function useFocusableTab(tabRef: Ref) {
  const focused = ref(false);
  const mouseDown = ref(false);
  const active = ref(false);

  const focus = () => {
    if (tabRef.value) {
      tabRef.value.focus();
    }
  };

  const onEnterKeyDown = () => {
    active.value = true;
  };

  const onEnterKeyUp = () => {
    active.value = false;
  };

  const onMouseDown = () => {
    mouseDown.value = true;
  };

  const onMouseUp = () => {
    mouseDown.value = false;
  };

  const onFocus = () => {
    focused.value = true;
  };

  const onBlur = () => {
    focused.value = false;
    active.value = false;
    mouseDown.value = false;
  };

  return {
    active,
    focused,
    tabRef,
    focus,
    onFocus,
    onBlur,
    onEnterKeyDown,
    onEnterKeyUp,
    onMouseDown,
    onMouseUp,
  };
}
