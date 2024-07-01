function isTag(v) {
  return !!(v).content;
}

export function renderTags(tags) {
  if (!tags) {
    return '';
  }
  return Object.values(tags)
    .map(([tag]) => renderTag(tag))
    .join('');
}

export function renderTag(tag, onlyContent = false) {
  if (!tag) {
    return '';
  }

  const { title: tagName, description, content } = tag;

  if (tagName === 'type') {
    return '';
  }

  return (!onlyContent ? `\n\@${tagName} ` : '') + (content || description);
}
