<script lang="ts">
  import { defineComponent, markRaw } from 'vue';

  export default defineComponent(markRaw({ name: 'PlusRoundedSmall' }));
</script>

<template>
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="currentColor"
      clip-path="url(#prefix__a)"
    >
      <path
        d="M4 8a1 1 0 0 1 1-1h2V5a1 1 0 0 1 2 0v2h2a1 1 0 1 1 0 2H9v2a1 1 0 1 1-2 0V9H5a1 1 0 0 1-1-1Z"
      />
      <path
        d="M12 0a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h8Zm0 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"
        clip-rule="evenodd"
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
