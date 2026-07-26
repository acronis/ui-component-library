/**
 * Root Prettier config.
 *
 * Scoped deliberately to the data/doc files that the root `lint-staged` entry
 * in package.json owns (repo-level *.json, *.md, *.yml, *.yaml). The options
 * mirror the shared house style in legacy/configs/.prettierrc.cjs — without
 * them, Prettier's defaults rewrite our single-quoted YAML globs to double
 * quotes, fighting the convention the rest of the repo declares.
 *
 * It is intentionally NOT a repo-wide config: package source (CSS/Vue/TS)
 * currently formats under Prettier's defaults, and switching it here would
 * newly unformat ~10 stylesheets in ui-syntax/ui-vue, whose own lint-staged
 * rules run `prettier --write` on *.css. Making the house style repo-wide is
 * worth doing, but as a deliberate one-time sweep (plus a
 * .git-blame-ignore-revs entry), not as a side effect of this config.
 */
module.exports = {
  overrides: [
    {
      files: ['*.json', '*.md', '*.yml', '*.yaml'],
      options: {
        printWidth: 100,
        singleQuote: true,
      },
    },
  ],
};
