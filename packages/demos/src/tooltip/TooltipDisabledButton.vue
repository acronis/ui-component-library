<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import AcvTooltip from '@/components/tooltip/tooltip.vue';
  import { ref } from 'vue';

  const isButtonDisabled = ref(false);
</script>

<template>
  <AcvTooltip content="Put the disabled button within a <div> or <span>">
    <div>
      <AcvButton disabled>
        Disabled Button
      </AcvButton>
    </div>
  </AcvTooltip>

  <AcvTooltip :content="isButtonDisabled ? 'Message for disabled state' : 'Message for normal state'">
    <div>
      <AcvButton :disabled="isButtonDisabled">
        Button
      </AcvButton>
    </div>
  </AcvTooltip>

  <AcvCheckbox
    v-model="isButtonDisabled"
    class="mt-16"
  >
    Toggle disabled
  </AcvCheckbox>
</template>
