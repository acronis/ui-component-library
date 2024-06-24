import { mdclean } from './utils.js';

function formatBindings(bindings) {
  return bindings?.map(({ name, description, type }) =>
    type ? `**${name}** \`${type.name === 'union' && type.elements ? type.elements.map(({ name }) => name).join(', ') : type.name}\` - ${description}` : ''
  ).join('\n') || '';
}

export default (slots, opt = {}) => `
${opt.isSubComponent || opt.hasSubComponents ? '#' : ''}## Slots
  | Name          | Description  | Bindings |
  | ------------- | ------------ | -------- |
  ${slots.map(({ description, bindings, name }) => `| ${mdclean(name)} | ${mdclean(description || '')} | ${mdclean(formatBindings(bindings))} |`).join('\n')}
`;
