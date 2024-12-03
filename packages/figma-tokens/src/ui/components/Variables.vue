<script setup>
  import { Button, Checkbox, Disclosure, DisclosureItem, Divider, Textarea } from '@acronis-platform/figma-ds-vue-plugin';

  import { onMounted, ref } from 'vue';
  import useVariables from '../composable/useVariables';
  import { downloadFile } from '../utils';

  const { variables, fetchVariables, cssVariables, jsonVariables } = useVariables();
  const showCssVariables = ref(false);
  const showJsonVariables = ref(false);

  onMounted(() => {
    fetchVariables();
  });

  function toggleCssVariables() {
    showCssVariables.value = !showCssVariables.value;
  }

  function toggleJsonVariables() {
    showJsonVariables.value = !showJsonVariables.value;
  }

  function downloadCssVariables() {
    downloadFile(cssVariables.value, 'css-variables.css');
  }

  function downloadJsonVariables() {
    downloadFile(jsonVariables.value, 'style-dictionary.json');
  }
</script>

<template>
  <Disclosure>
    <DisclosureItem
      v-for="variableCollection in variables"
      :key="variableCollection.id"
      :title="variableCollection.name"
    >
      <table>
        <tr>
          <td>Modes</td>
          <td
            v-for="mode in variableCollection.modes"
            :key="mode.modeId"
          >
            {{ mode.name }}
          </td>
          <td>
            <Checkbox />
          </td>
        </tr>
        <tr
          v-for="variable in variableCollection.variables"
          :key="variable.id"
        >
          <td>{{ variable.name }}</td>
          <td
            v-for="mode in variableCollection.modes"
            :key="mode.modeId"
          >
            {{ variable.valuesByMode[mode.modeId] }}
          </td>
          <td>
            <Checkbox />
          </td>
        </tr>
      </table>
    </DisclosureItem>
  </Disclosure>

  <Divider />

  <Button
    class="m-xsmall"
    @click="downloadCssVariables"
  >
    Download css variables
  </Button>

  <Button
    class="m-xsmall"
    @click="downloadJsonVariables"
  >
    Download json variables
  </Button>

  <Button
    secondary
    class="m-xsmall"
    @click="toggleCssVariables"
  >
    {{ showCssVariables ? 'Hide' : 'Show' }} css variables
  </Button>

  <Button
    secondary
    class="m-xsmall"
    @click="toggleJsonVariables"
  >
    {{ showJsonVariables ? 'Hide' : 'Show' }} json variables
  </Button>

  <Textarea
    v-if="showCssVariables"
    v-model="cssVariables"
    class="m-xsmall"
    rows="10"
  >
  </Textarea>

  <Textarea
    v-if="showJsonVariables"
    v-model="jsonVariables"
    class="m-xsmall"
    rows="10"
  >
  </Textarea>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;

  th, td {
    text-align: left;
    padding: 0.5rem;
    border-bottom: 1px solid hsl(0deg, 0%, 91%);
  }
}
</style>
