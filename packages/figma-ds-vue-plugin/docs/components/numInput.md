---
description: ''
sidebar: 'docs'
prev: '/docs/components/input/'
next: '/docs/components/radio-menu/'
---

<script>
export default {
	data: () => ({
		numModel: 0
	}),
}
</script>

# Number Input

<ComponentWrapper>
 <NumInput v-model="numModel" icon="horizontal-padding" min="0" max="100" unit="px"/>
</ComponentWrapper>

### Props

| Prop       | Type            | Default/Notes                                                                                                                                                  |
| :--------- |:----------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `@input`   | `Func()`        | Handle event emitted from the component, ex: `@input={funcName}`                                                                                               |
| `@change`  | `Func()`        | Handle event emitted from the component, ex: `@change={funcName}`                                                                                              |
| `value`    | `Number`        | Default: `0`                                                                                                                                                   |
| `min`      | `Number`        | Default: `undefined`; Minimum value of number input                                                                                                            |
| `max`      | `Number`        | Default: `undefined`; Maximum value of number input                                                                                                            |
| `steps`    | `Number`        | Default: `1`; Amount of increments/decrements when scrubbing the number field                                                                                  |
| `unit`     | `String/Number` | Default: `undefined`; Append a unit (string) to the number. Just for visuals, component will always return a number                                            |
| `border`   | `Boolean`       | Default: `false`; Force border around input field. Border usually appears when element is hovered, active or focused. _A set placeholder also forces a border_ |
| `disabled` | `Boolean`       | Default: `false`                                                                                                                                               |
| `icon`     | `String`        | _See [Icon](/components/icon#props) component for usage_                                                                                                       |
| `iconText` | `String`        | _See [Icon](/components/icon#props) component for usage_                                                                                                       |
| `spinning` | `Boolean`       | _See [Icon](/components/icon#props) component for usage_                                                                                                       |

### Example usage

```html
<template>
	<NumInput icon="W" min="0" max="100" unit="px" />
</template>

<script>
	import { NumInput } from '@ui-kit/figma-ds-vue-plugin'

	export default {
	       data: () => ({
		    numInputModel: // String || Number
	    }),
		components: {
			NumInput
		}
	}
</script>
```
