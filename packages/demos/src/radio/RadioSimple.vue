<script setup>
  import AcvRadio from '@/components/radio/radio.vue';
  import { ref } from 'vue';

  const boolean = ref(true);
  const number = ref(0);
  const string = ref('test');
</script>

<template>
  <div>
    <AcvRadio
      v-model="number"
      :value="0"
    >
      O
    </AcvRadio>
    <AcvRadio
      v-model="number"
      :value="1"
      label="1"
    />
    <AcvRadio
      v-model="number"
      color="error"
      :value="2"
      label="2"
    />
    <AcvRadio
      v-model="number"
      :color="theme => theme.colors.cyan[400]"
      :value="3"
      label="3"
    />
  </div>
  <div>
    <AcvRadio
      v-model="boolean"
      :value="true"
    >
      True
    </AcvRadio>
    <AcvRadio
      v-model="boolean"
      :value="false"
    >
      False
    </AcvRadio>
  </div>
  <div>
    <AcvRadio
      v-model="string"
      value="test"
    />
    or
    <AcvRadio
      v-model="string"
      value="test-2"
    />
  </div>
</template>
