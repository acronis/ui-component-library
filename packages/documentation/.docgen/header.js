import { customAcvTitleCase } from '@acronis-platform/utils';

export default function header(
  docs,
  config,
  hasSubComponent,
  componentRelativePath
) {
  const frontMatter = [];
  const fileNameRoot = componentRelativePath.split('/').pop()?.split('.').shift() || 'Component';

  if (docs.length === 1) {
    const [doc] = docs;
    const { name, displayName, tags } = doc;
    const outputName = customAcvTitleCase(name || displayName);

    const { deprecated } = tags || {};
    if (!config.outFile && deprecated) {
      // to avoid having the squiggles in the left menu for deprecated items
      // use the front matter feature of vuepress
      frontMatter.push(`title: ${displayName}`);
    }

    frontMatter.push(`title: ${outputName} component`);
    frontMatter.push('lang: en-US');
    frontMatter.push('editLink: true');
    frontMatter.push('description: This file is generated automatically from the source code. Changes made here will be lost.');
  }

  if (hasSubComponent) {
    // show more than one level on subcomponents
    frontMatter.push('sidebarDepth: 2');
  }

  return frontMatter.length
    ? `
---
${frontMatter.join('\n')}
---
${docs.length > 1 ? `# ${fileNameRoot}\n` : ''}
`
    : '';
}
