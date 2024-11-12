<script setup>
  import AcvChart from '@/components/chart/chart.vue';
  import chartjsPluginDragdata from 'chartjs-plugin-dragdata';

  const toHSLArray = hslStr => hslStr.match(/\d+/g)?.map(Number);

  function parseColor(colorName) {
    if (typeof window !== 'undefined') {
      const color = window.getComputedStyle(document.documentElement)
        .getPropertyValue(`--acv-color-${colorName}`);
      return toHSLArray(color);
    }

    return 'dummy';
  }
  const colorNames = [
    'amber',
    'blue',
    'brown',
    'cyan',
    'deep-purple',
    'dodge-blue',
    'gray',
    'green',
    'indigo',
    'light-blue',
    'light-green',
    'orange',
    'pink',
    'primary',
    'purple',
    'red',
    'secondary',
    'teal',
    'tertiary',
    'yellow',
    // 'black',
  ];

  const lights = [
    'lightest',
    'lighter',
    'light',
    '',
    'dark',
    'darker',
    'darkest',
  ];

  function parseColors() {
    return colorNames.reduce((acc, colorName) => {
      acc[colorName] = lights.map((light) => {
        return parseColor(`${colorName}${light ? `-${light}` : ''}`);
      });

      return acc;
    }, {});
  }

  const colorValues = parseColors();

  function getChartData(colorName) {
    return {
      labels: [
        'lightest',
        'lighter',
        'light',
        colorName,
        'dark',
        'darker',
        'darkest',
      ],
      datasets: [
        {
          label: `${colorName} colors attractiveness curve`,
          data: colorValues[colorName].map(color => color && ({ x: color[1], y: color[2] })),
          pointRadius: 15,
          backgroundColor: colorValues[colorName].map(
            color => color && (`hsl(${color[0]}deg ${color[1]}% ${color[2]}%)`)
          ),
          borderWidth: 2.5,
          fill: false,
          pointHitRadius: 25,
          showLine: true,
        }
      ],
      options: {
        layout: { padding: { left: 20, right: 20, top: 20, bottom: 10 } },
        scales: { y: { beginAtZero: true, min: -76, max: 78 } },
      }
    };
  }
</script>

<template>
  <AcvChart
    v-for="color in colorNames"
    :key="color"
    type="scatter"
    :data="getChartData(color)"
    :plugins="[chartjsPluginDragdata]"
    :options="{
      plugins: {
        dragData: {
          dragX: true,
          dragY: true,
          round: 2,
          showTooltip: false,
          magnet: {
            to: Math.round, // to: (value) => value + 5
          },
        },
      } }"
  />
</template>
