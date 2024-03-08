<template>
  <preview-group class="qa-button-states">
    <preview name="Default" span="8">
      <el-button>Primary</el-button>
      <div class="my-8"></div>
      <el-button type="secondary">Secondary</el-button>
      <div class="my-8"></div>
      <el-button type="ghost">Ghost</el-button>
      <div class="my-8"></div>
      <el-button type="danger">Danger</el-button>
      <div class="my-8"></div>
      <el-button type="success">Success</el-button>
      <div class="my-8"></div>
      <el-button type="translucent">Translucent</el-button>
      <div class="my-8"></div>
      <div class="dark-bg pa-16">
        <el-button type="translucent">Translucent Dark</el-button>
      </div>
      <div class="my-8"></div>
      <el-button type="promo">Promo</el-button>
    </preview>
    <preview name="Hover" span="8">
      <el-button class="is-hover">Primary</el-button>
      <div class="my-8"></div>
      <el-button class="is-hover" type="secondary">Secondary</el-button>
      <div class="my-8"></div>
      <el-button class="is-hover" type="ghost">Ghost</el-button>
      <div class="my-8"></div>
      <el-button class="is-hover" type="danger">Danger</el-button>
      <div class="my-8"></div>
      <el-button class="is-hover" type="success">Success</el-button>
      <div class="my-8"></div>
      <el-button class="is-hover" type="translucent">Translucent</el-button>
      <div class="my-8"></div>
      <div class="dark-bg pa-16">
        <el-button class="is-hover" type="translucent">Translucent Dark</el-button>
      </div>
      <div class="my-8"></div>
      <el-button class="is-hover" type="promo">Promo</el-button>
    </preview>
    <preview name="Active" span="8">
      <el-button class="is-active">Primary</el-button>
      <div class="my-8"></div>
      <el-button class="is-active" type="secondary">Secondary</el-button>
      <div class="my-8"></div>
      <el-button class="is-active" type="ghost">Ghost</el-button>
      <div class="my-8"></div>
      <el-button class="is-active" type="danger">Danger</el-button>
      <div class="my-8"></div>
      <el-button class="is-active" type="success">Success</el-button>
      <div class="my-8"></div>
      <el-button class="is-active" type="translucent">Translucent</el-button>
      <div class="my-8"></div>
      <div class="dark-bg pa-16">
        <el-button class="is-active" type="translucent">Translucent Dark</el-button>
      </div>
      <div class="my-8"></div>
      <el-button class="is-active" type="promo">Promo</el-button>
    </preview>
    <preview name="Focus" span="8">
      <el-button class="is-focus">Primary</el-button>
      <div class="my-8"></div>
      <el-button class="is-focus" type="secondary">Secondary</el-button>
      <div class="my-8"></div>
      <el-button class="is-focus" type="ghost">Ghost</el-button>
      <div class="my-8"></div>
      <el-button class="is-focus" type="danger">Danger</el-button>
      <div class="my-8"></div>
      <el-button class="is-focus" type="success">Success</el-button>
      <div class="my-8"></div>
      <el-button class="is-focus" type="translucent">Translucent</el-button>
      <div class="my-8"></div>
      <div class="dark-bg pa-16">
        <el-button class="is-focus" type="translucent">Translucent Dark</el-button>
      </div>
      <div class="my-8"></div>
      <el-button class="is-focus" type="promo">Promo</el-button>
    </preview>
    <preview name="Disabled" span="8">
      <el-button class="is-disabled">Primary</el-button>
      <div class="my-8"></div>
      <el-button class="is-disabled" type="secondary">Secondary</el-button>
      <div class="my-8"></div>
      <el-button class="is-disabled" type="ghost">Ghost</el-button>
      <div class="my-8"></div>
      <el-button class="is-disabled" type="danger">Danger</el-button>
      <div class="my-8"></div>
      <el-button class="is-disabled" type="success">Success</el-button>
      <div class="my-8"></div>
      <el-button class="is-disabled" type="translucent">Translucent</el-button>
      <div class="my-8"></div>
      <div class="dark-bg pa-16">
        <el-button class="is-disabled" type="translucent">Translucent Dark</el-button>
      </div>
      <div class="my-8"></div>
      <el-button class="is-disabled" type="promo">Promo</el-button>
    </preview>
    <preview name="Loading" span="8">
      <el-button loading>Primary</el-button>
      <div class="my-8"></div>
      <el-button loading type="secondary">Secondary</el-button>
      <div class="my-8"></div>
      <el-button loading type="ghost">Ghost</el-button>
      <div class="my-8"></div>
      <el-button loading type="danger">Danger</el-button>
      <div class="my-8"></div>
      <el-button loading type="success">Success</el-button>
      <div class="my-8"></div>
      <el-button loading type="translucent">Translucent</el-button>
      <div class="my-8"></div>
      <div class="dark-bg pa-16">
        <el-button loading type="translucent">Translucent Dark</el-button>
      </div>
      <div class="my-8"></div>
      <el-button loading type="promo">Promo</el-button>
    </preview>
  </preview-group>
</template>

<script setup>
  import ElButton from 'packages/button';
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';
</script>

<style lang="scss" scoped>
  @import 'themes/acronis/src/common/variables/colors';

  .dark-bg {
    background-color: $av-nav-primary;
    background-clip: padding-box;
  }

  .dark-bg :deep(.preview__caption) {
    color: $av-nav-text;
  }
</style>
