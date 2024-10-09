export function dataGen(length) {
  return Array.from({ length })
    .map((x, i) => ({
      id: i,
      name: `VM-${i}-${Math.random() >= 0.5 ? 'a' : 'b'}`,
      status: i % 10 !== 3 ? 'OK' : 'Critical',
      plan: i % 10 !== 3 ? 'Scheduled' : 'No Plan',
      message: i % 10 !== 3
        ? `Sample detail message for VM-${i}`
        : `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
      consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
      dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
      commodo consequat. Duis auteirure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
      pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est 
      laborum.VM-${i}`
    }));
}

export function treeDataGen(branch, depth, parent) {
  return Array.from({ length: branch }).map((x, i) => {
    const v = parent ? `${parent}-${i}` : `${i}`;
    const node = { label: v, value: v };
    if (depth - 1 > 0) {
      node.children = treeDataGen(branch, depth - 1, v);
    }
    return node;
  });
}

const getRandomNumber = (from, to) => Math.floor(Math.random() * to) + from;
export function optionsGen(total = 10, name = 'Crystal') {
  return Array.from({ length: total })
    .map((x, i) => ({
      id: `${i}`,
      name: `${name} ${i}`,
      randomName: `${name.repeat(getRandomNumber(1, 3))} ${i}`,
      count: getRandomNumber(1, total),
      index: i
    }));
}
