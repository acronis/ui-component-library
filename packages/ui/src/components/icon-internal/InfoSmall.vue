<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'InfoSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#prefix__a)">
      <circle
        cx="8"
        cy="8"
        r="8"
        fill="#408BEA"
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
        d="M8 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 1a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Z"
      />
    </g>
    <defs>
      <clipPath id="prefix__a">
        <path
          fill="#fff"
          d="M0 0h16v16H0z"
        />
      </clipPath>
    </defs>
  </svg>
</template>
