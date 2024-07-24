---
description: ''
sidebar: 'docs'
prev: '/docs/components/select-menu/'
next: '/docs/components/text/'
---

# Label

<ComponentWrapper>
<Label style="width: auto">Lorem ipsum</Label>
</ComponentWrapper>

### Example usage

```html
<template>
	<Label>Box title</Label>
	<Input v-model="inputModel" placeholder="Text" />
</template>

<script>
	import { Label, Input } from '@ui-kit/figma-ds-vue-plugin'

	export default {
	    data: () => ({
		    inputModel: // String || Number
	    }),
		components: {
			Label,
	        Input
		}
	}
</script>
```
