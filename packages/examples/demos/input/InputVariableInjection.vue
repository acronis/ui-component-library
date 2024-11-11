<script setup>
  import { ref } from 'vue';

  //
  //
  import AcvInput from '@/components/input/input.vue';
  import AcvLink from '@/components/link/link.vue';

  const textarea = ref('');
  const variableInjection = ref(null);
  const freezeFocus = ref(false);
  const variableList = ref(['[Disk name]', '[Plan name]', '[Workload name]', '[Monitor name]', '[Customer name]']);

  function handleClick(name) {
    variableInjection.value.injectText(name);
  }
</script>

<template>
  <div class="qa-input-textarea-variable-injection">
    <PreviewGroup>
      <Preview
        name="Default"
        span="8"
        align-items="stretch"
      >
        <AcvInput
          id="variableInjection"
          ref="variableInjection"
          v-model="textarea"
          label="Label"
          type="textarea"
          class="py-8"
          :freeze-focus="freezeFocus"
        />
        <div class="acv-text acv-text--body-24 py-8">
          The following variables can be used:
        </div>
        <template
          v-for="name in variableList"
          :key="name"
        >
          <AcvLink
            id="variable-injection"
            class="acv-text acv-text--body-24"
            @click="handleClick(name)"
          >
            {{ name }}
          </AcvLink>
        </template>
      </Preview>
    </PreviewGroup>
  </div>
</template>
