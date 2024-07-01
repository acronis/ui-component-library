<template>
  <preview-group>
    <preview
      name="acv-overflow--auto"
      span="8"
    >
      <div class="acv-overflow--auto acv-size--width-100">
        <div class="acv-text--nowrap">
          this content will show a native scroll bar because it overflows parent
        </div>
      </div>
    </preview>
    <preview
      name="acv-overflow--hidden"
      span="8"
    >
      <div class="acv-overflow--hidden acv-size--width-100">
        <div class="acv-text--nowrap">
          the overflowed content will be hidden in this example
        </div>
      </div>
    </preview>
  </preview-group>
</template>
