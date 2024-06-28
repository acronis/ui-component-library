# Icons

## Installation

Install the package in your project directory with the following:

```shell
npm install @acronis-platform/icons
```

## Documentation

This package contains a collection of icons that can be used in your project.
The icons are available in SVG format and can be used in your project by importing the SVG file.

## Usage

You can import icons in your project by using the following code:

```javascript
// Import icon as a Vue component
import { IconName } from '@acronis-platform/icons';
```

```javascript
// Import icons as a Iconify IconSet collection
import collection from '@acronis-platform/icons/acronis/icons.json';
```

##  What's included

- We take icons from the Figma design system with @acronis-platform/figma-fetcher and convert them to SVG format.
- All icons are available in SVG format, and original source files are available in the `src` directory.
- All icons are split into collections and available in the `src/collections` directory.
- We provide exports for each icon in the `src/index.ts` file.
- Also, we generate and provide vue components for each icon in the `src/components` directory.

## Workflow

Figma Design system -> SVG -> Vue Components

## Ways of using svg icons
Best way to use svg icons in your project is to use them as Vue components. 
In order to do that, you can simply rename them from `.svg` to `.vue` extension and wrapping with template.

You can use them in your project in the following ways:

- As an SVG file, for instance, using [vite-svg-loader](https://www.npmjs.com/package/vite-svg-loader)
- As a dynamic Vue component:

```vue
<script>
import { defineAsyncComponent } from 'vue';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  computed: {
    dynamicComponent() {
      const name = this.name;

      return defineAsyncComponent(() => import(`./icons/${name}.vue`));
    },
  },
};
</script>

<template>
  <component :is="dynamicComponent" />
</template>
```
Usage:
```vue
<script>
  import SvgIcon from './components/SvgIcon.vue'

  export default {
    components: {
      SvgIcon
    }
  }
</script>

<template>
  <SvgIcon name="user" />
</template>
```

- as a Vue component with dynamic svg import:

```vue
<template>
    <i v-html="svg" />
</template>

<script lang="ts" setup>
    import { computed } from 'vue';

    const props = defineProps({
        icon: {
            type: String,
            required: true,
        },
        src: {
            type: String,
            default: '',
        },
    });
    const path = props.src ? props.src : '';
    const file = `${path}icon-${props.icon}`;
    const modules = import.meta.glob('../../assets/icons/**/*.svg', {
        as: 'raw',
        eager: true,
    });
    const svg = computed(() => {
        return modules['../../assets/icons/' + file + '.svg'] ?? modules['../../assets/icons/icon-logo-cone.svg'];
    });
</script>
```
Usage:
```vue
<UiIcon
    class="w-4 text-gray-600"
    icon="search"
/>
```

- solution from [Vite docs](https://vitejs.dev/guide/features.html#glob-import):
```vue
<script setup>
  import { defineAsyncComponent, computed } from 'vue'
  
  const props = defineProps({
    name: {
      type: String,
      required: true
    }
  })
  const icons = import.meta.glob(`./**/*.svg`)
  const icon = computed(() => {
    return defineAsyncComponent(() => this.icons[`./${this.name}.svg`]())
  })
  const className = computed(() => {
    return `icon icon-${this.name}`
  })
</script>

<template>
  <component :is="icon" :class="className" />
</template>
```
