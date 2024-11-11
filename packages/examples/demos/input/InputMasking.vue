<script setup>
  import AcvInput from '@/components/input/input.vue';

  import { ref } from 'vue';

  const input1 = ref('');
  const input2 = ref('');
  const input3 = ref('');
  const input4 = ref('');
  const input5 = ref('');
  const input6 = ref('');
</script>

<template>
  <div class="qa-input-mask">
    <PreviewGroup>
      <Preview
        span="8"
        name="MAC address"
        align-items="stretch"
      >
        <AcvInput
          v-model="input1"
          :mask="{
            mask: '**-**-**-**-**-**',
          }"
          placeholder="A8-B6-E0-91-D7-AE"
          label="MAC address"
        />
      </Preview>
      <Preview
        span="8"
        name="IP address"
        align-items="stretch"
      >
        <AcvInput
          v-model="input2"
          :mask="{
            mask: '0[00].0[00].0[00].0[00]',
          }"
          placeholder="192.168.0.1"
          label="IP address"
        />
      </Preview>
      <Preview
        span="8"
        name="CVE"
        align-items="stretch"
      >
        <AcvInput
          v-model="input3"
          :mask="{
            mask: 'CVE-0000-0000000',
          }"
          placeholder="CVE-0000-0000000"
          label="CVE"
          prefix-value="CVE-"
        />
      </Preview>
      <Preview
        span="8"
        name="MAC address with delay mask"
        align-items="stretch"
      >
        <AcvInput
          v-model="input4"
          :debounce-process-mask="500"
          :mask="{
            mask: '**-**-**-**-**-**',
          }"
          placeholder="A8-B6-E0-91-D7-AE"
          label="MAC address"
        />
      </Preview>
      <Preview
        span="8"
        name="IP address with delay mask"
        align-items="stretch"
      >
        <AcvInput
          v-model="input5"
          :mask="{
            mask: '0[00].0[00].0[00].0[00]',
          }"
          placeholder="192.168.0.1"
          :debounce-process-mask="500"
          label="IP address"
        />
      </Preview>
      <Preview
        span="8"
        name="CVE with delay mask"
        align-items="stretch"
      >
        <AcvInput
          v-model="input6"
          :mask="{
            mask: 'CVE-0000-0000000',
          }"
          placeholder="CVE-0000-0000000"
          :debounce-process-mask="500"
          label="CVE"
          prefix-value="CVE-"
        />
      </Preview>
    </PreviewGroup>
  </div>
</template>
