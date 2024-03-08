<template>
  <div class="el-sidebar-title">
    <div class="el-sidebar-title__wrapper">
      <div
        v-if="title"
        class="el-text el-text--strong el-sidebar-title__main-title"
      >
        {{ this.title }}
      </div>
      <div
        v-if="title && subtitle"
        class="el-text el-text--caption el-sidebar-title__subtitle"
      >
        {{ this.subtitle }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ElSidebarTitle',

    props: {
      title: {
        type: String,
        default: ''
      },
      subtitle: {
        type: String,
        default: ''
      }
    }
  };
</script>
