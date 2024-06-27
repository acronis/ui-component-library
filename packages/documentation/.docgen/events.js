import { mdclean } from './utils.js';

function formatProperties(properties) {
  if (!properties) {
    return '';
  }
  return properties
    .map((property) => {
      const { name, description, type } = property;
      if (!type) {
        return '';
      }
      return `**${name}** \`${type.names.length ? type.names.join(', ') : ''}\` - ${description}`;
    })
    .join('\n');
}

function tmpl(events) {
  let ret = '';
  events.forEach((evt) => {
    const { description = '', ...e } = evt;
    const readableProperties = e.properties ? `${formatProperties(e.properties)}` : '';
    ret += `| ${mdclean(e.name)} | ${mdclean(readableProperties)} | ${mdclean(description)} |\n`;
  });
  return ret;
}

export default (events, opt = {}) => {
  return `
${opt.isSubComponent || opt.hasSubComponents ? '#' : ''}## Events

  | Event name     | Properties     | Description  |
  | -------------- |--------------- | -------------|
  ${tmpl(events)}
  `;
};
