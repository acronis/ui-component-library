<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'SuccessSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#success--16_svg__a)">
      <circle
        cx="8"
        cy="8"
        r="8"
        fill="#9BC225"
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
        fill-rule="evenodd"
        d="M11.707 5.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L7 8.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
        clip-rule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="success--16_svg__a">
        <path
          fill="#fff"
          d="M0 0h16v16H0z"
        />
      </clipPath>
    </defs>
  </svg>
</template>
