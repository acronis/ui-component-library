/**
 * ESLint rule: steer a hand-placed row of stat tiles — a single parent element
 * with two or more direct `<CardFilter>` children — to the `StatRow` composite.
 *
 * Part of the pattern-enforcement set (see
 * `context/opinionated-composites-proposal.md` §6). Warn-first and conservative:
 * it fires only on 2+ CardFilter siblings under one parent (a KPI/stat row),
 * which StatRow renders uniformly from a `stats` list; a lone CardFilter is left
 * alone.
 */

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer the StatRow composite over a hand-placed row of multiple CardFilter tiles.',
    },
    schema: [],
    messages: {
      preferStatRow:
        'Row of {{count}} CardFilter tiles detected. Prefer the `StatRow` composite — render them from a `stats` list so the KPI row stays uniform (consistent variants, gaps, and wrapping).',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        const cardFilters = node.children.filter(
          (child) =>
            child.type === 'JSXElement' &&
            child.openingElement?.name?.type === 'JSXIdentifier' &&
            child.openingElement.name.name === 'CardFilter'
        );
        if (cardFilters.length >= 2) {
          context.report({
            node: node.openingElement,
            messageId: 'preferStatRow',
            data: { count: String(cardFilters.length) },
          });
        }
      },
    };
  },
};

export default rule;
