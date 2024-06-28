<template>
  <div class="demo-preview-group">
    <div class="preview-group">
      <div class="preview-group__wrapper">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-preview-group {
  margin: 0;
}

.preview-group {
  .preview-group__wrapper {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -1px -1px;
  }
}
</style>
