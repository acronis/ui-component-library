export function fuzzyMatch(partials: string[], total: string[], includeAll = false) {
  const matched: string[] = [];

  partials.forEach((partial) => {
    for (const target of total) {
      if (target.match(partial)) {
        matched.push(target);

        if (!includeAll) {
          break;
        }
      }
    }
  });

  return matched;
}
