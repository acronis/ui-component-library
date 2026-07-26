let id = 0;

function loadCascaderOptions(node, resolve) {
  const { level } = node;
  setTimeout(() => {
    const nodes = Array.from({ length: level + 1 })
      .map(_item => ({
        value: ++id,
        label: `Option - ${id}`,
        leaf: level >= 2
      }));
    resolve(nodes);
  }, 1000);
}

export default loadCascaderOptions;
