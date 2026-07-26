<script>
// @deprecated
// import scssVariables from '@/styles/colors.scss';
// import { getBrand } from '@/utils/local-storage';

  export default {
    props: {
      colors: {
        type: Array,
        default: () => ([])
      }
    },
    data() {
      return {
        // theme: getBrand()[0],
        colorNames: {},
        colorValues: {}
      };
    },

    mounted() {
      this.updateColors();
    },

    methods: {
      updateColors() {
        if (!this.$el) {
          return;
        }

        this.colors.forEach((color) => {
          const id = `color-${color}`;
          const element = document.getElementById(id);

          this.$set(this.colorNames, id, color);
          this.$set(this.colorValues, id, getComputedStyle(element).backgroundColor);
        });
      },
      getColor(color) {
        if (!color) {
          return;
        }

        const camelize = s => s.replace(/-./g, x => x[1].toUpperCase()).slice(1);
        const cssValue = scssVariables[camelize(color)];

        return cssValue || color;
      }
    }
  };
</script>

<template>
  <ul
    class="colors qa-colors-brand-primary"
  >
    <li
      v-for="color in colors"
      :id="`color-${color}`"
      :key="`color-${color}`"
      class="color"
      :data-color="color"
      :style="{ backgroundColor: getColor(color) }"
    >
      <span>{{ colorNames[`color-${color}`] }}</span>
      <span>{{ colorValues[`color-${color}`] }}</span>
    </li>
  </ul>
</template>

<style scoped>
.colors {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 48px;
  padding: 0;
  list-style: none;
}

.color {
  box-sizing: border-box;
  padding: 62px 0 0 32px;
  width: 320px;
  height: 128px;
  font: 500 14px/24px 'Roboto Mono', monospace;
  white-space: nowrap;
  margin: 0 16px 16px 0;
  border: 1px solid var(--acv-color-brand-primary);

  & span {
    display: block;
    background: var(--acv-color-accent);
    color: var(--acv-color-brand-primary);
    padding: 4px 8px;
  }
}
</style>
