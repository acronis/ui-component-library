import type { FormContext, FormOptions } from 'vee-validate';
import { useForm } from 'vee-validate';

export type GoFormValues = Record<string, any>;

export type VeeOptions<TValues extends GoFormValues> = FormOptions<TValues>;

export type GoVeeContext<Values extends GoFormValues> = FormContext<Values>;

export function provideGoFormVee<Values extends GoFormValues>(
  options: VeeOptions<Values> = {},
): GoVeeContext<Values> {
  return useForm<Values>({ keepValuesOnUnmount: true, ...options });
}
