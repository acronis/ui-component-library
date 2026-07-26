<script setup>
  import AcvLink from '@/components/link/link.vue';
  import { vTextMiddleEllipsis } from '@/directives/textMiddleEllipsis.ts';
</script>

<template>
  <div class="acv-text acv-text--body-24">
    <AcvLink href="#/web/utilities">
      <span v-text-middle-ellipsis:show-hover-hint>
        C:\Users\ui.kit\Desktop\Folder\testfile.txt
      </span>
    </AcvLink>
  </div>
  <div class="acv-text acv-text--body-24">
    <AcvLink href="#/web/utilities">
      <span v-text-middle-ellipsis:show-hover-hint>
        /users/ui.kit/desktop/folder/testfile.txt
      </span>
    </AcvLink>
  </div>
</template>

<style scoped>
  .acv-text {
    width: 200px;
  }
</style>
