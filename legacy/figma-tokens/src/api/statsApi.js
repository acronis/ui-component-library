async function getStats(figma) {
  await figma.loadAllPagesAsync();

  let nodeCount = 0;
  const nodeTypeCounts = new Map();

  function visit(node) {
    nodeTypeCounts.set(node.type, 1 + (nodeTypeCounts.get(node.type) | 0));
    nodeCount++;
    if (!['COMPONENT', 'COMPONENT_SET', 'VECTOR', 'FRAME'].includes(node.type) && node.children) {
      node.children.forEach(visit);
    }
  }

  visit(figma.root);

  let text = `Node count: ${nodeCount}\n`;

  const nodeTypes = Array.from(nodeTypeCounts.entries());

  nodeTypes.sort((a, b) => b[1] - a[1]);

  text += `Node types:${nodeTypes.map(([k, v]) => `\n  ${k}: ${v}`).join('')}`;

  return text;
}

export { getStats };
