/**
 * Replaces returns and tubes to make the input compatible with markdown
 * also makes sure < and > are escaped so html tags are not rendered
 * @param input
 */
export function mdclean(input) {
  if (typeof input !== 'string') {
    return `${input}`;
  }
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br/>');
}
