# Icons

## Installation

Install the package in your project directory with the following:

```shell
npm install @acronis-platform/icons
```

## Documentation

This package contains a collection of icons that can be used in your project.
The icons are available in SVG and Vue.js SFC format and can be used in your project by importing the modules.

## Usage

You can import icons in your project by using the following code:

```javascript
// Import icon as a Vue component
import { IconName } from '@acronis-platform/icons';

// Import individual icon from collection
import { IconName } from '@acronis-platform/icons/acronis';

// Import individual vue icon from directory
import ChevronDown from '@acronis-platform/icons/acronis/chevron/ChevronDown.vue';

// Import icons as a Iconify IconSet collection
import collection from '@acronis-platform/icons/acronis/icons.json';
```

##  What's included

- Figma design system provide icons;
- With @acronis-platform/figma-fetcher and save them in SVG format, as original source files in the `src` directory;
- Icons can be fetched as different collections, they will be available in the `src/collections` directory;
- Icons can be imported as individual icons and as a whole collection with barrel file;
- All icons provide Vue.js component for each icon in the `vue` directory.

## How to use svg icons in Vue.js components
Best way to use svg icons in your project is to use them as Vue components. 
In order to do that, you can simply rename them from `.svg` to `.vue` extension and wrapping with template.

You can use them in your project in the following ways:

- As an SVG file, for instance, using [vite-svg-loader](https://www.npmjs.com/package/vite-svg-loader)
- As a static Vue.js component:

```vue  
<script setup>
  import ChevronDownIcon from './components/ChevronDownIcon.vue'
</script>

<template>
  <ChevronDownIcon />
</template>
```


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
<script setup>
  import SvgIcon from './components/SvgIcon.vue'
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


## Custom icons

Icon library can be extended and customized with your own icon files.

You can overwrite the existing icons or add new ones by placing them in the `src` directory.
You need to add your own SVG icons and include them into icons library build process.

### Avoid naming conflicts

If you create an icon with the same name as an existing one, your icon will overwrite the existing one.
If your icon uses a name That not been used before, it will be added as a new icon.

To check which names are already in use, look in the `src` directory.
When create a new icon, make sure that the name is unique.
Otherwise, it will overwrite the existing icon.
