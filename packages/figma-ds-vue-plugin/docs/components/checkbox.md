---
title: Checkbox
---

<script setup>
import {ref} from "vue"; 

const checkboxModel = defineModel()
</script>

# Checkbox

<ComponentWrapper >
<Checkbox v-model="checkboxModel"> {{checkboxModel ? 'Checked' : 'Unchecked'}} </Checkbox>
<Checkbox disabled>Disabled</Checkbox>
</ComponentWrapper>

### Props

| Prop       | Type       | Default/Notes                                                    |
| :--------- |:-----------| :--------------------------------------------------------------- |
| `@input`   | `Func()`   | Handle event emitted from the component, ex: `@input={funcName}` |
| `value`    | `Boolean`  | Default: `false`                                                 |
| `checked`  | `Boolean`  | Default: `undefined`                                             |
| `disabled` | `Boolean`  | Default: `false`                                                 |

### Example usage

```html
<template>
	<Checkbox v-model="checkboxModel">Close Figma on startup</Checkbox>
</template>

<script>
	import { Checkbox } from '@ui-kit/figma-ds-vue-plugin'

	export default {
	    data: () => ({
		    checkboxModel: // Boolean
	    }),
		components: {
			Checkbox
		}
	}
</script>
```
