<script setup>
  const colorNames = [
    'red',
    'pink',
    'purple',
    'deep-purple',
    'indigo',
    'blue',
    'dodge-blue',
    'light-blue',
    'cyan',
    'teal',
    'green',
    'light-green',
    // 'lime',
    'yellow',
    'amber',
    'orange',
    // 'deep-orange',
    'brown',
    'gray',
    // 'blue-gray',
    'primary',
    'secondary',
    'tertiary'
  ];

  const colorShades = [
    'lightest',
    'lighter',
    'light',
    '',
    'dark',
    'darker',
    'darkest'
  ];
</script>

<template>
  <div>
    <div class="flex flex-wrap">
      <div
        v-for="color in colorNames"
        :key="color"
        class="w-1/4 p-4"
      >
        <div
          v-for="shade in colorShades"
          :key="shade"
          class="p-2"
          :style="{
            backgroundColor: `var(--acv-color-${color}${shade ? `-${shade}` : ''})`,
            color: `var(--acv-color-${color}${shade ? `-${shade}` : ''}-text)`,
          }"
        >
          --acv-color-{{ color }}{{ shade ? `-${shade}` : '' }}
        </div>
      </div>
    </div>
  </div>
</template>
