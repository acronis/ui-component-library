import { mdclean } from './utils';
import { renderTags } from './tags';

function tmpl(expose, subComponent) {
  return expose.map(exp => `
${subComponent ? '#' : ''}### ${exp.name || ''}

  > ${exp.description || ''} ${mdclean(renderTags(exp.tags?.reduce((acc, tag) => {
    acc[tag.title] = [tag];
    return acc;
  }, {}))) || ''}
 `).join('');
}

export default (expose, opt = {}) => Object.keys(expose).length === 0
  ? ''
  : `
${opt.isSubComponent || opt.hasSubComponents ? '#' : ''}## Expose

  ${tmpl(expose, opt.isSubComponent || opt.hasSubComponents || false)}
  `;
