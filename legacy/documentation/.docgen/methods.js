import { mdclean } from './utils';

function paramsTmpl(params, subComponent) {
  let ret = `
${subComponent ? '#' : ''}#### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  `;

  params.forEach((p) => {
    const t = p.type && p.type.name ? p.type.name : '';
    const n = p.name ? p.name : '';
    const d = typeof p.description === 'string' ? p.description : '';

    ret += `| ${mdclean(n)} | ${mdclean(t)} | ${mdclean(d)} |\n`;
  });

  return ret;
}

function returnsTemplate(ret, subComponent) {
  const p = ret;
  const t = p.type && p.type.name ? p.type.name : '';
  const d = p.description ? p.description : '';

  return `
${subComponent ? '#' : ''}#### Return

  | Type        | Description  |
  | ------------- | -------------|
  | ${t} | ${d} |
  `;
}

const tmpl = function (methods, subComponent) {
  let ret = '';

  methods.forEach((m) => {
    ret += `
${subComponent ? '#' : ''}### ${m.name ? m.name : ''}
  > ${m.description || ''}

  ${m.params ? paramsTmpl(m.params, subComponent) : ''}
  ${m.returns ? returnsTemplate(m.returns, subComponent) : ''}
  `;
  });
  return ret;
};

export default (methods, opt = {}) => {
  if (Object.keys(methods).length === 0) {
    return '';
  }
  return `
${opt.isSubComponent || opt.hasSubComponents ? '#' : ''}## Methods

  ${tmpl(methods, opt.isSubComponent || opt.hasSubComponents || false)}
  `;
};
