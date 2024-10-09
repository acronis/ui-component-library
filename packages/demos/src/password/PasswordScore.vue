<script setup>
  import AcvPassword from '@/components/password/password.vue';
  import { computed, ref } from 'vue';

  //
  //

  defineProps({
    responsiveScore: {
      type: Boolean,
      default: false
    }
  });
  const p21 = ref('pas');
  const p22 = ref('password');
  const p31 = ref('passw');

  const p31Score = computed(() => {
    const len = p31.value.length;
    return len === 0 ? 0 : len <= 6 ? 1 : len <= 8 ? 2 : 3;
  });
</script>

<template>
  <template v-if="!responsiveScore">
    <PreviewGroup class="qa-password-score">
      <Preview
        name="Default"
        span="8"
        align-items="stretch"
      >
        <AcvPassword
          label="Password"
          :score="0"
        />
      </Preview>
      <Preview
        name="With description"
        span="8"
        align-items="stretch"
      >
        <AcvPassword
          label="Password"
          :score="0"
          description="Must contain at least 5 characters"
        />
      </Preview>
      <Preview
        name="When error"
        span="8"
        align-items="stretch"
      >
        <AcvPassword
          label="Password"
          :score="0"
          description="Must contain at least 5 characters"
          is-error
        />
      </Preview>
      <Preview
        name="Password weak"
        span="8"
        align-items="stretch"
      >
        <AcvPassword
          v-model="p21"
          label="Password"
          :score="1"
        />
      </Preview>
      <Preview
        name="Password normal"
        span="8"
        align-items="stretch"
      >
        <AcvPassword
          v-model="p22"
          label="Password"
          :score="2"
        />
      </Preview>
      <Preview
        name="Password strong"
        span="8"
        align-items="stretch"
      >
        <AcvPassword
          v-model="p22"
          label="Password"
          :score="3"
        />
      </Preview>
    </PreviewGroup>
  </template>
  <template v-else>
    <PreviewGroup class="qa-password-responsive-score">
      <Preview
        name="Responsive score"
        span="8"
        align-items="stretch"
      >
        <AcvPassword
          v-model="p31"
          label="Password"
          :score="p31Score"
        />
      </Preview>
    </PreviewGroup>
  </template>
</template>
