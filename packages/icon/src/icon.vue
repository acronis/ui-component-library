<template>
  <img
    v-if="!!iconUrl && iconUrlFound"
    :src="iconUrl"
    :width="variant"
    :class="{
      [name]: isFontFullName,
      [`${prefix}-${name}--${computedVariant}`]: name && variant && !isFontFullName,
      'is-disabled': disabled,
      'is-right': right,
      'is-left': left
    }"
    alt="Icon"
    class="i"
    @error="onIconError"
    @click="onClickIcon"
  >
  <i
    v-else-if="!legacy"
    class="i is-latest qa-icon"
    :class="{
      [name]: isFontFullName,
      [`${prefix}-${name}--${computedVariant}`]: name && variant && !isFontFullName,
      [`${prefix}--size-${computedSize}`]: size || variant,
      [`${prefix}--color-${color}`]: color,
      'is-disabled': disabled,
      'is-right': right,
      'is-left': left,
      'is-multi-color': isMultiColor
    }"
    @click="onClickIcon"
  >
    <i
      v-if="state"
      class="i__state is-latest qa-icon-state"
      :class="{
        [state]: state,
        [`${prefix}--size-${computedSize}`]: size || variant,
        [`${prefix}--color-${color}`]: color,
        'is-disabled': disabled,
        'is-multi-color': isStateMultiColor
      }"
    >
      <component
        :is="stateComponent"
        :class="svgIconComponentClass"
      />
    </i>
    <component
      :is="iconComponent"
      :class="svgIconComponentClass"
    />
  </i>
  <i
    v-else-if="!isSvgIcon"
    class="i qa-icon"
    :class="{
      [name]: isFontFullName,
      [`${prefix}-${name}--${computedVariant}`]: name && variant && !isFontFullName,
      [`${prefix}--size-${computedSize}`]: size || variant,
      [`${prefix}--color-${color}`]: color,
      'is-disabled': disabled,
      'is-right': right,
      'is-left': left
    }"
    @click="onClickIcon"
  >
    <i
      v-if="state"
      class="i__state qa-icon-state"
      :class="{
        [state]: state,
        [`${prefix}--size-${computedSize}`]: size || variant,
        [`${prefix}--color-${color}`]: color,
        'is-disabled': disabled
      }"
    />
  </i>
  <svg
    v-else
    :key="svgIconPath"
    class="svg qa-svg"
    :class="{
      [name]: isFontFullName,
      [`svg-${name}--${computedVariant}`]: name && variant && !isFontFullName,
      [`svg--size-${computedSize}`]: size || variant
    }"
  >
    <use v-bind="{ 'xlink:href': svgIconPath, 'href': svgIconPath }" />
  </svg>
</template>

<script>
  import { defineAsyncComponent } from 'vue'
  export default {
    name: 'ElIcon',

    props: {
      name: {
        type: String,
        required: true
      },
      prefix: {
        type: String,
        default: 'i'
      },
      state: {
        type: [String, Boolean],
        default: false
      },
      variant: {
        type: String,
        default: '16'
      },
      useSvg: {
        type: Boolean,
        default: false
      },
      legacy: {
        type: Boolean,
        default: false
      },
      svgSpritePath: {
        type: String,
        default: ''
      },
      iconUrl: {
        type: String,
        default: ''
      },
      size: String,
      color: String,
      disabled: Boolean,
      right: Boolean,
      left: Boolean
    },

    data() {
      const basePath = 'icons';
      return {
        variants: {
          sm: 16,
          md: 24,
          lg: 32
        },
        sizes: {
          sm: 16,
          md: 24,
          lg: 32,
          xlg: 96
        },
        iconUrlFound: true,
        icons: import.meta.glob(`icons/**/*.svg`),
        basePath
      };
    },

    computed: {
      isSvgIcon() {
        return this.useSvg || /^(clr)-/.test(this.name);
      },

      isFontFullName() {
        return /^(i|clr)-/.test(this.name);
      },

      svgIconPath() {
        if (this.isSvgIcon) {
          const iconName = this.isFontFullName
            ? this.name.slice(4)
            : this.name;
          let svgIconPath = `assets/sprite.symbol.svg#${iconName}`;
          if (this.svgSpritePath) {
            svgIconPath = `${this.svgSpritePath}#${iconName}`;
          } else if (this.$svgSpritePath) {
            svgIconPath = `${this.$svgSpritePath}#${iconName}`;
          }
          return svgIconPath;
        }
        return '';
      },

      iconPath() {
        let iconName = this.name;
        if (this.isFontFullName) {
          iconName = this.name && this.name.startsWith('clr') ? `multicolor-icons/${this.name.slice(4)}` : `monocolor-icons/${this.name.slice(2)}`;
        } else {
          iconName = `monocolor-icons/${this.name}--${this.computedVariant}`;
        }
        return iconName;
      },

      statePath() {
        const stateName = this.state.startsWith('clr') ? `multicolor-icons/${this.state.slice(4)}` : `monocolor-icons/${this.state.slice(2)}`;
        return stateName;
      },

      computedVariant() {
        return this.variants[this.variant] || this.variant;
      },

      computedSize() {
        return this.sizes[this.size] || this.size || (this.isFontFullName && this.name.substr(-2)) || this.variant;
      },

      isMultiColor() {
        return this.name && this.name.startsWith('clr');
      },

      isStateMultiColor() {
        return this.state.startsWith('clr');
      },
      svgIconComponentClass() {
        return {
          'svg': true,
          'qa-svg': true,
          [`svg--size-${this.computedSize}`]: this.size || this.variant
        };
      },
      stateComponent() {
        return defineAsyncComponent(() => {
          return this.icons[`${this.basePath}/${this.statePath}.svg`]();
        });
      },
      iconComponent() {
        return defineAsyncComponent(() => {
          return this.icons[`${this.basePath}/${this.iconPath}.svg`]();
        });
      }
    },

    methods: {
      click: function (e) {
        this.$emit('click', e);
      },
      onIconError: function () {
        this.iconUrlFound = false;
      }
    }
  };
</script>