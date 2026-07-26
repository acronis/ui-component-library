import { escapeRegExp } from 'lodash-es';

export function fuzzyMatch(partials: string[], total: string[], includeAll = false) {
  const matched: string[] = [];

  partials.forEach((partial) => {
    const safePartial = escapeRegExp(partial);

    for (const target of total) {
      if (target.match(safePartial)) {
        matched.push(target);

        if (!includeAll) {
          break;
        }
      }
    }
  });

  return matched;
}
