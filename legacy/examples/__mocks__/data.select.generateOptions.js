export const multiLine = {
  value: '',
  options: [
    {
      label: 'Antimalware software status',
    },
    {
      label: 'AutoRun feature status',
    },
    {
      label: 'Backup status',
    },
    {
      label: 'CPU temperature',
    }
  ].map((e) => {
    e.value = e.label;
    e.subLabel = 'Monitors whether antimalware software is installed, turned on.';
    e.rightIcons = [
      {
        name: 'adv--16',
        color: 'brand-primary'
      },
      {
        name: 'windows--16',
        color: 'fixed-lightest'
      },
      {
        name: 'apple--16',
        color: 'fixed-lightest'
      },
      {
        name: 'linux--16',
        color: 'brand-primary'
      }
    ];

    return e;
  })
};

export function treeDataGen(branch, depth, parent, icon, iconColor) {
  return Array.from({ length: branch }).map((x, i) => {
    const v = parent ? `${parent}-${i}` : `${i}`;
    const node = {
      label: v,
      value: v,
      icon,
      iconColor
    };
    if (depth - 1 > 0) {
      node.children = treeDataGen(branch, depth - 1, v, icon, iconColor);
    }
    return node;
  });
}

export function optionsGen(total = 8, prefix = 'Option') {
  return Array.from({ length: total })
    .map((x, i) => ({
      value: `${prefix} ${i}`,
      label: `${prefix} ${i}`
    }));
}

const statuses = [
  {
    label: 'Not defined',
    icon: 'ban-o--16',
    color: 'brand-light'
  },
  {
    label: 'Approved',
    icon: 'check-circle--16',
    color: 'fixed-success'
  },
  {
    label: 'Declined',
    icon: 'times-circle--16',
    color: 'fixed-danger'
  }
];

function optionsGenWithIcon(total = 3) {
  return Array.from({ length: total })
    .map((x, i) => ({
      value: statuses[i].label,
      ...statuses[i]
    }));
}

const cities = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

const identity = x => x;

export const getOptionsCities = () => cities.map((item, i) => ({ value: i, label: item }));

export function gg(customizeOpts = identity) {
  return (value = '') => ({
    value,
    options: customizeOpts(optionsGen())
  });
}

export function ggWithIcon(customizeOpts = identity) {
  return (value = '') => ({
    value,
    options: customizeOpts(optionsGenWithIcon())
  });
}

export const objectValues = [
  {
    label: 'Avengers',
    value: {
      'Captain America': 'Steven \'Steve\' Rogers',
      'Iron man': 'Anthony \'Tony\' Edward Stark',
      'Hulk': 'Dr. Robert Bruce Banner',
      'Black Panther': 'T\'Challa'
    }
  },
  {
    label: 'Justice League',
    value: {
      'Superman': 'Clark Kent',
      'Batman': 'Bruce Wayne',
      'Wonder Woman': 'Diana Prince',
      'Aquaman': 'Arthur Curry',
      'Green Lantern': 'Hal Jordan',
      'The Flash': 'Barry Allen'
    }
  },
  {
    label: 'X-Men',
    value: {
      'Professor X': 'Charles Francis Xavier',
      'Cyclops': 'Scott Summers',
      'Iceman': 'Robert Louis \'Bobby\' Drake',
      'Wolverine': { fullName: { firstName: 'James', lastName: 'Howlett' }, name: 'Logan' },
      'Storm': 'Ororo Monroe',
      'Beast': 'Henry Philip \'Hank\' McCoy'
    }
  }
];

export function generateTenOptions() {
  return (value = '') => ({
    value,
    options: optionsGen(10)
  });
}

export function generateMediumOptions() {
  return (value = '') => ({
    value,
    options: optionsGen(100)
  });
}

export function generateLargeOptions() {
  return (value = '') => ({
    value,
    options: optionsGen(1000)
  });
}

export function generateLongOptions() {
  return (value = '', total = 10) => ({
    value,
    options: optionsGen(total, 'Very long items in default Select dropdown list. It is really very long items - №')
  });
}

export const arrayValues = [
  {
    label: 'Avengers',
    value: [
      'Captain America',
      'Iron man',
      'Hulk',
      'Black Panther'
    ]
  },
  {
    label: 'Justice League',
    value: [
      'Superman',
      'Batman',
      'Wonder Woman',
      'Aquaman',
      'Green Lantern',
      'The Flash'
    ]
  },
  {
    label: 'X-Men',
    value: [
      'Professor X',
      'Cyclops',
      'Iceman',
      { fullName: { firstName: 'James', lastName: 'Howlett' }, name: 'Logan', nickname: 'Wolverine' },
      'Storm',
      'Beast'
    ]
  }
];
