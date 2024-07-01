<script setup>
  import { vTextMiddleEllipsis } from '@/directives/textMiddleEllipsis.ts';
  import Icon from '@/components/icon/icon.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <Row
    :gap="32"
    :columns="2"
  >
    <preview
      name="Windows path"
      span="12"
    >
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis>C:\Users\ui.kit\Desktop\Folder\Folder\testfile.txt</span>
      </div>
    </preview>
    <preview
      name="Linux/Mac path"
      span="12"
    >
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis>/users/ui.kit/desktop/folder/folder/testfile.txt</span>
      </div>
    </preview>
    <preview
      name="With hint when hover"
      span="12"
    >
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis:show-hover-hint>C:\Users\ui.kit\Desktop\Folder\Folder\testfile.txt</span>
      </div>
    </preview>
    <preview
      name="Window path with long file name"
      span="12"
    >
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis:show-hover-hint>C:\\Users\\Css.Test\\Desktop\\windows-text-middle-ellipsis-no-hint.txt</span>
      </div>
    </preview>
    <preview
      name="Mac path with long file name"
      span="12"
    >
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis:show-hover-hint>/User/abcde/Downloads/eicarcom2.zip.download</span>
      </div>
    </preview>
    <preview
      name="very long file name"
      span="12"
    >
      <div class="acv-size--width-100">
        <span v-text-middle-ellipsis:show-hover-hint>/usr/veryveryveryveryverylongfilename.txt</span>
      </div>
    </preview>

    <preview
      name="With icon"
      span="12"
    >
      <div class="acv-size--width-100 acv-text--nowrap example-with-long-name">
        <span
          v-text-middle-ellipsis
          class="long"
        >
          /usr/veryveryveryveryverylongfilename.txt
        </span>
        <Icon
          class="link__icon acv-bg--solid-brand-light"
          name="i-external-link--16"
        />
      </div>
    </preview>
  </Row>
</template>

<style scoped>
  :deep(.preview__content) {
    background-color: hsl(155deg, 76%, 84%);
  }
</style>
