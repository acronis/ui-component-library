import { getDefaultExample } from 'vue-docgen-api';

export default (doc) => {
  return `
\`\`\`vue live
${getDefaultExample(doc)}
\`\`\`
`;
};
