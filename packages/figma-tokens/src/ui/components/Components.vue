<script setup>
  import { ref } from 'vue';
  import { Button, Disclosure, DisclosureItem } from '@ui-kit/figma-ds-vue-plugin';
  import { on } from '@create-figma-plugin/utilities';
  import useComponents from '../composable/useComponents';

  const {
    components,
    getComponents,
    createComponent
  } = useComponents();

  on('SET_COMPONENT', (res) => {
    // stats.value = res;
    //
    // isLoading.value = false;
  });

  const components2 = ref([
    {
      name: 'Button',
      description: 'A button',
      properties: [
        {
          name: 'color',
          type: 'string',
          description: 'The color of the button',
          default: '#000000',
        },
        {
          name: 'size',
          type: 'string',
          description: 'The size of the button',
          default: 'medium',
        },
      ],
    },
    {
      name: 'Checkbox',
      description: 'A checkbox',
      properties: [
        {
          name: 'checked',
          type: 'boolean',
          description: 'Whether the checkbox is checked',
          default: 'false',
        },
      ],
    },
  ]);
</script>

<template>
  <Disclosure>
    <DisclosureItem title="Page name">
      <table>
        <tr>
          <td>Primary</td>
          <td>#FF0000</td>
        </tr>
        <tr>
          <td>Secondary</td>
          <td>#00FF00</td>
        </tr>
        <tr>
          <td>Tertiary</td>
          <td>#0000FF</td>
        </tr>
      </table>
    </DisclosureItem>
  </Disclosure>
  <div class="m-small">
    <Button @click="createComponent">
      Create component
    </Button>
  </div>
</template>
