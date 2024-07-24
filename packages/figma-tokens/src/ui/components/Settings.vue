<script setup>
  import { Button, Divider, Radio, Tooltip } from '@ui-kit/figma-ds-vue-plugin';
</script>

<template>
  <Radio>Add token type to name of the token</Radio>
  <Divider />
  Design tokens File name: <Input /> <Tooltip
    position="tl"
    width="100"
  >
    Why you need filename settings
  </Tooltip>

  <Divider />

  <h4>Token prefixes</h4>
  Default prefix: <Input value="acv" />
  Color prefix: <Input value="color" />
  Typography prefix: <Input value="typography" />

  <Button>Save settings</Button>
</template>
