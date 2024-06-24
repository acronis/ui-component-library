import type { ParsedArgs } from 'minimist';
import { components } from './constant.ts';
import { specifyFromList } from './specifyFromList.ts';

export async function specifyComponent(
  args: ParsedArgs,
  allComponents = components,
  required = true
) {
  return await specifyFromList(args, allComponents, {
    required,
    message: 'Select a component:',
    errorMessage: 'Component must be specified.'
  });
}
