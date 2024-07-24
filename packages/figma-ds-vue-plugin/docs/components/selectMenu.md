---
description: ''
sidebar: 'docs'
prev: '/docs/components/radio-menu/'
next: '/docs/components/label/'
---

# Select menu

<ComponentWrapper>
<Select
	style="width: 200px"
	:items="[
						{
							icon: 'heart',
							label: 'Item 1',
							key: 'item-1'
						},
						{
							divider: true
						},
						{
							icon: 'heart-fill',
							label: 'Item 2',
							key: 'item-2'
						}
					]"
/>
</ComponentWrapper>

### Props

| Prop          | Type            | Default/Notes                                                                                                                                                                                                       |
| :------------ |:----------------| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@input`      | `Func()`        | Handle event emitted from the component, ex: `@input={funcName}`                                                                                                                                                    |
| `SelectText`  | `String`        | Format: `[{ icon: String, label: String, key: String | Number }, {divider: Boolean}]` Pass an array of objects containing an optional icon, option name and key (value). Pass `{divider: true}` to create a divider |
| `placeholder` | `String/Number` | Default: `undefined`; Default: undefined; Placeholder when no key/value is selected                                                                                                                                 |
| `value`       | `String/Number` | Default: `undefined`                                                                                                                                                                                                |
| `open`        | `Boolean`       | Default: `undefined`; Control open/close state of the select menu                                                                                                                                                   |
| `disabled`    | `Boolean`       | Default: `false`                                                                                                                                                                                                    |

### Example usage

```html
<template>
	<Select
		:items="[
                    {
                        icon: 'heart',
                        label: 'Item 1',
                        key: 'item-1'
                    },
                    {
                        divider: true
                    },
                    {
                        icon: 'heart-fill',
                        label: 'Item 2',
                        key: 'item-2'
                    }
				]"
		v-model="selectModel"
	/>
</template>

<script>
	import { Select } from '@ui-kit/figma-ds-vue-plugin'

	export default {
	    data: () => ({
		    selectModel: // Value of selected Select key
	    }),
		components: {
			Select
		}
	}
</script>
```
