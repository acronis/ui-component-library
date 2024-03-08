<template>
  <div class="el-whatisnew-item">
    <div
      v-if="showUpsellBadge"
      class="el-whatisnew-item__upsell-badge"
    >
      <slot name="upsell-badge" />
    </div>
    <div
      class="el-whatisnew-item__image"
      :class="{'el-whatisnew-item__image--empty': !imageSlot}"
    >
      <slot :name="imageSlot" />
    </div>
    <div class="el-whatisnew-item__description">
      <div class="el-whatisnew-item__title el-text el-text--display-medium mb-16">
        {{ title }}
      </div>
      <div class="el-text el-text--body-24">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WhatisnewItem',
    props: {
      showUpsellBadge: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        required: true
      },
      imageSlot: {
        type: String,
        required: true
      }
    }
  };
</script>
