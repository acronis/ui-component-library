import process from 'node:process';
import { components } from './constant.ts';
import { fuzzyMatch } from './fuzzyMatch.ts';
import { logger } from './logger.ts';

export function fuzzyMatchComponent(
  partialComponents: string[],
  includeAll = false,
  allComponents = components
) {
  const matched = fuzzyMatch(partialComponents, allComponents, includeAll);

  if (matched.length) {
    return matched;
  }
  logger.withBothLn(() => logger.error(`No component matches '${partialComponents}'!`));
  process.exit(1);
}
