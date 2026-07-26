const names = [
  'Total protect',
  'Backup + active protection',
  'Backup with notarization',
  'Entire machine to cloud',
  'Backup with patch management',
  'Backup with anti-malware',
  'Microsoft SQL to Acronis',
  'Google cloud to Acronis',
  'Backup with URL filtering',
  'Device protection',
  'Essential protection'
];
const devices = Array.from({ length: 30 }, (v, k) => k + 1);
const status = [
  'OK',
  'Not Protected',
  'Critical'
];

function* percentageMaker() {
  let p = 0;
  while (true) {
    p++;
    yield p % 100;
  }
}

const percentageGen = percentageMaker();

function dataGen(length) {
  const x = status.length;
  const y = devices.length;
  const z = names.length;
  const results = [];

  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      for (let k = 0; k < z; k++) {
        results.push({
          id: `${k}${j}${i}`,
          name: names[k],
          devices: devices[j],
          percentage: percentageGen.next().value,
          status: status[i]
        });
        if (results.length === length) {
          return results;
        }
      }
    }
  }
  return results;
}

export default dataGen;
