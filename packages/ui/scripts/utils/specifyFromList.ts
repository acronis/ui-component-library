import process from 'node:process';
import type { ParsedArgs } from 'minimist';
import prompts from 'prompts';
import { fuzzyMatch } from './fuzzyMatch.ts';
import { logger } from './logger.ts';

export interface SpecifyOptions {
  required?: boolean
  message?: string
  errorMessage?: string
}

export async function specifyFromList(
  args: ParsedArgs,
  list: string[],
  options: SpecifyOptions = {}
) {
  const matchedItems = args._.length ? fuzzyMatch(args._, list, true) : [''];

  let item: string;

  if (matchedItems.length > 1 || !matchedItems[0]) {
    item = (
      await prompts({
        type: 'autocomplete',
        name: 'item',
        message: options.message || 'Select one from below:',
        choices: (matchedItems.length > 1 ? matchedItems : list).map(name => ({
          title: name,
          value: name
        })),
        onState(this: any) {
          this.fallback = { title: this.input, value: this.input };
          if (this.suggestions.length === 0) {
            this.value = this.fallback.value;
          }
        }
      })
    ).item;
  }
  else {
    item = matchedItems[0] || '';
  }

  if (!item && options.required) {
    logger.withStartLn(() => logger.error(options.errorMessage || 'The above must be specified.'));
    process.exit(1);
  }

  return item;
}
