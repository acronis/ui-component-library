<script setup>
  import AcvIcon from '@/components/icon/icon.vue';
  import { vTextMiddleEllipsis } from '@/directives/textMiddleEllipsis.ts';
  import { IconPlus16 } from '@acronis-platform/icons/plus';
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-3">
    <div>
      <h4 class="acv-h4">
        Windows path
      </h4>
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis>C:\Users\ui.kit\Desktop\Folder\Folder\testfile.txt</span>
      </div>
    </div>
    <div>
      <h4 class="acv-h4">
        Linux/Mac path
      </h4>
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis>/users/ui.kit/desktop/folder/folder/testfile.txt</span>
      </div>
    </div>
    <div>
      <h4 class="acv-h4">
        With hint when hover
      </h4>
      <div class="acv-text acv-size--width-100">
        <span v-text-middle-ellipsis:show-hover-hint>C:\Users\ui.kit\Desktop\Folder\Folder\testfile.txt</span>
      </div>
    </div>
    <div>
      <h4 class="acv-h4">
        Window path with long file name
      </h4>
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis:show-hover-hint>C:\\Users\\Css.Test\\Desktop\\windows-text-middle-ellipsis-no-hint.txt</span>
      </div>
    </div>
    <div>
      <h4 class="acv-h4">
        Mac path with long file name
      </h4>
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis:show-hover-hint>/User/abcde/Downloads/eicarcom2.zip.download</span>
      </div>
    </div>
    <div>
      <h4 class="acv-h4">
        very long file name
      </h4>
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis:show-hover-hint>/usr/veryveryveryveryverylongfilename.txt</span>
      </div>
    </div>

    <div>
      <h4 class="acv-h4">
        With icon
      </h4>
      <div class="acv-size--width-100 acv-text--nowrap">
        <span
          v-text-middle-ellipsis
          class="long"
        >
          /usr/veryveryveryveryverylongfilename.txt
        </span>
        <AcvIcon
          class="link__icon acv-bg--solid-brand-light"
          :icon="IconPlus16"
        />
      </div>
    </div>

    <div>
      <h4 class="acv-h4">
        With title
      </h4>
      <div class="acv-size--width-100 acv-text--nowrap">
        <span v-text-middle-ellipsis:show-hover-hint>
          /usr/veryveryveryveryverylongfilename.txt
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .acv-grid-row > * {
    background-color: var(--acv-color-primary-lightest);
    width: 100%;
    overflow: hidden;
    min-height: 100px;
    padding-inline: 8px;
  }
</style>
