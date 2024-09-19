import { useField, useFieldValue } from 'vee-validate';
import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import { omit } from '@acronis-platform/utils';
import type { GoFormContextService } from './formContext';
import { getGoFormContext } from './formContext';
import type { GoFormValues, GoVeeContext, VeeOptions } from './formVee';
import { provideGoFormVee } from './formVee';
import type { RuleExpression } from './validation';

export type GoFormService<Values extends GoFormValues> = Omit<
  GoVeeContext<Values>,
  'submitForm' | 'handleSubmit'
> &
GoFormContextService<Values>;

const goFormKey: InjectionKey<GoFormService<GoFormValues>> = Symbol('baseForm');

export function injectGoForm<Values extends GoFormValues = GoFormValues>() {
  return inject(goFormKey)! as GoFormService<Values>;
}

export function injectGoFormSafe<Values extends GoFormValues = GoFormValues>() {
  return inject(goFormKey, undefined) as GoFormService<Values> | undefined;
}

export function provideGoForm<Values extends GoFormValues = GoFormValues>(
  options: VeeOptions<Values> = {},
): GoFormService<Values> {
  const veeService = provideGoFormVee<Values>(options);
  const contextService = getGoFormContext<Values>(veeService);
  const api = {
    ...omit(veeService, ['submitForm', 'handleSubmit']),
    ...contextService,
  };

  provide(goFormKey, api);

  return api;
}

export function useGoField<TValue = unknown>(
  name: string,
  rules?: RuleExpression<TValue>,
): ReturnType<typeof useField<TValue>> {
  // @ts-expect-error TODO: to remove @ts-expect-error need to use RuleExpression from vee-validate. But lib don't export it
  const field = useField<TValue>(name, rules, { syncVModel: false });

  return { ...field };
}

export function useGoFieldModel<V>(name: string) {
  const { setFieldValue } = injectGoForm();
  const value = useFieldValue<V>(name);

  return { value, setValue };

  function setValue(newValue: V) {
    setFieldValue(name, newValue);
  }
}
