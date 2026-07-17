/**
 * ESLint rule: steer a hand-composed confirmation modal — an `AlertDialog`
 * containing both an `AlertDialogCancel` and an `AlertDialogAction` (the
 * canonical two-button confirm) — to the `ConfirmDialog` composite.
 *
 * Part of the pattern-enforcement set (one focused rule per approved
 * composition; see `context/opinionated-composites-proposal.md` §6). It's the
 * "prefer-*" dial: warn-first, conservative. It only fires on the exact
 * confirm shape (Cancel + Action inside one AlertDialog), so a bespoke
 * AlertDialog with a custom footer is left alone.
 */

/** Walk up to the nearest enclosing `<AlertDialog>` JSXElement, if any. */
function alertDialogAncestor(node) {
  for (let cur = node.parent; cur; cur = cur.parent) {
    if (
      cur.type === 'JSXElement' &&
      cur.openingElement?.name?.type === 'JSXIdentifier' &&
      cur.openingElement.name.name === 'AlertDialog'
    ) {
      return cur;
    }
  }
  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prefer the ConfirmDialog composite over a hand-composed AlertDialog confirmation (title + Cancel + Action).',
    },
    schema: [],
    messages: {
      preferConfirmDialog:
        'Hand-composed confirmation modal detected (AlertDialog with Cancel + Action). Prefer the `ConfirmDialog` composite — one component for the approved title/consequence/two-action shape (focus defaults to Cancel, no click-outside dismiss).',
    },
  },
  create(context) {
    // Per enclosing AlertDialog: which of Cancel / Action we've seen.
    const seen = new Map();
    const mark = (node, key) => {
      const ad = alertDialogAncestor(node);
      if (!ad) return;
      const rec = seen.get(ad) ?? {};
      rec[key] = true;
      seen.set(ad, rec);
    };
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        if (node.name.name === 'AlertDialogCancel') mark(node, 'cancel');
        else if (node.name.name === 'AlertDialogAction') mark(node, 'action');
      },
      'JSXElement:exit'(node) {
        if (
          node.openingElement?.name?.type !== 'JSXIdentifier' ||
          node.openingElement.name.name !== 'AlertDialog'
        ) {
          return;
        }
        const rec = seen.get(node);
        if (rec?.cancel && rec?.action) {
          context.report({
            node: node.openingElement,
            messageId: 'preferConfirmDialog',
          });
        }
      },
    };
  },
};

export default rule;
