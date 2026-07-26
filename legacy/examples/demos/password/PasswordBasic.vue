<script setup>
  import AcvPassword from '@/components/password/password.vue';
  import { ref } from 'vue';

  const password = ref('passwd');
</script>

<template>
  <preview-group class="qa-password-basic">
    <preview
      name="Default"
      span="8"
      align-items="stretch"
    >
      <AcvPassword
        v-model="password"
        label="Password"
      />
    </preview>
    <preview
      name="With icon default hide"
      span="8"
      align-items="stretch"
    >
      <AcvPassword
        v-model="password"
        label="Password"
        with-icon
      />
    </preview>
    <preview
      name="With icon default show"
      span="8"
      align-items="stretch"
    >
      <AcvPassword
        v-model="password"
        label="Password"
        with-icon
        default-type="text"
      />
    </preview>
    <preview
      name="With description"
      span="8"
      align-items="stretch"
    >
      <AcvPassword
        v-model="password"
        label="Password"
        description="Must contain at least 5 characters"
      />
    </preview>
    <preview
      name="When error"
      span="8"
      align-items="stretch"
    >
      <AcvPassword
        v-model="password"
        label="Password"
        description="Must contain at least 5 characters"
        is-error
      />
    </preview>
  </preview-group>
</template>
