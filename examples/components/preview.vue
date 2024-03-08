<template>
  <div
    class="preview"
    :class="{
      [`preview--color-${background}`]: background,
      'preview--has-background': background,
      'preview--has-caption': name
    }"
    :style="`width: ${ (100 / (24 / span)).toFixed(2) }%`">
    <div
      class="preview__content"
      :class="[
        `justify-content--${justifyContent}`,
        `align-items--${alignItems}`
      ]">
      <slot/>
    </div>
    <div
      v-if="name"
      class="preview__caption"
      :class="[{ 'is-inverse': inverse}]"
    >{{ name }}</div>
  </div>
</template>

<script>
  export default {
    props: {
      name: String,
      span: {
        type: String,
        default: '24'
      },
      justifyContent: {
        type: String,
        default: 'center'
      },
      alignItems: {
        type: String,
        default: 'center'
      },
      background: String,
      inverse: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
