import type { SubmissionHandler } from 'vee-validate';
import { ref } from 'vue';
import type { PromiseFunction } from '@acronis-platform/utils';
import type { GoFormValues, GoVeeContext } from './formVee';
import { trackPromiseFunction } from '@/composables/trackPromiseFunction.ts';
import { useLoadState } from '@/composables/loadState.ts';

export type GoFormContextService<Values extends GoFormValues> = ReturnType<
  typeof getGoFormContext<Values>
>;

/**
 * Handle loading state / submit error catch. vee-validate doesn't do this
 * Every component inside form can inject this context
 */
export function getGoFormContext<Values extends GoFormValues>(
  veeForm: GoVeeContext<Values>,
) {
  const { loadState, setLoading, setError, setLoaded, setBlank } = useLoadState();
  const submitError = ref<unknown>();
  const wrap = trackPromiseFunction(beforeLoad, onSuccess, onError);
  let submitFormCallback: (event?: Event) => Promise<unknown>;

  return {
    loadState,
    submitError,
    submitForm,
    handleSubmit,
    resetGoForm,
  };

  async function submitForm(event?: Event) {
    await submitFormCallback(event);
  }

  function handleSubmit<Fn extends PromiseFunction>(fn: Fn) {
    submitFormCallback = veeForm.handleSubmit(wrap(fn) as unknown as SubmissionHandler<Values>);
    return submitForm;
  }

  function onSuccess() {
    setLoaded();
  }

  function beforeLoad() {
    resetGoForm();
    setLoading();
  }

  function onError(error: unknown) {
    submitError.value = error;
    setError();
  }

  function resetGoForm() {
    submitError.value = undefined;
    setBlank();
  }
}
