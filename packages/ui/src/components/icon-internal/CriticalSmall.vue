<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'CriticalSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#critical--16_svg__a)">
      <circle
        cx="8"
        cy="8"
        r="8"
        fill="#FF810D"
      />
      <circle
        cx="8"
        cy="8"
        r="7.5"
        stroke="#243143"
        stroke-opacity=".1"
      />
      <path
        fill="#fff"
        d="M8 4a1 1 0 0 0-1 1v2.5a1 1 0 0 0 2 0V5a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      />
    </g>
    <defs>
      <clipPath id="critical--16_svg__a">
        <path
          fill="#fff"
          d="M0 0h16v16H0z"
        />
      </clipPath>
    </defs>
  </svg>
</template>
