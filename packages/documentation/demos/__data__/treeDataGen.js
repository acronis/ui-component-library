function getTreeData(customize = v => v) {
  return customize([{
    label: '1',
    value: 1,
    children: [{
      label: '1-1',
      value: 2,
      children: [{
        label: '1-1-1',
        value: 3
      }]
    }]
  }, {
    label: '2',
    value: 4,
    children: [{
      label: '2-1',
      value: 5,
      children: [{
        value: 6,
        label: '2-1-1'
      }]
    }, {
      label: '2-2',
      value: 7,
      children: [{
        value: 8,
        label: '2-2-1'
      }, {
        value: 61,
        label: '2-1-2'
      }]
    }]
  }, {
    label: '3',
    value: 9,
    children: [{
      label: '3-1',
      value: 10,
      children: [{
        value: 11,
        label: '3-1-1'
      }]
    }, {
      value: 12,
      label: '3-2',
      children: [{
        value: 13,
        label: '3-2-1'
      }]
    }]
  }]);
}

export default getTreeData;
