<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDrawer from '@/components/drawer/drawer.vue';
  import { ref } from 'vue';

  const isDrawerLeftShown = ref(false);
  const isDrawerRightShown = ref(false);
  const isDrawerTopShown = ref(false);
  const isDrawerBottomShown = ref(false);
</script>

<template>
  <AcvButton
    class="mr-4"
    @click="isDrawerLeftShown = true"
  >
    Left
  </AcvButton>
  <AcvButton
    class="mr-4"
    @click="isDrawerRightShown = true"
  >
    Right
  </AcvButton>
  <AcvButton
    class="mr-4"
    @click="isDrawerTopShown = true"
  >
    Top
  </AcvButton>
  <AcvButton @click="isDrawerBottomShown = true">
    Bottom
  </AcvButton>

  <AcvDrawer
    v-model="isDrawerLeftShown"
    anchor="left"
    title="CARPE DIEM, SESTIUS"
    subtitle="Solvitur acris hiems grata vice veris et Favoni
trahuntque siccas machinae carinas"
  />

  <AcvDrawer
    v-model="isDrawerRightShown"
    anchor="right"
    title="CARPE DIEM, SESTIUS"
    subtitle="Solvitur acris hiems grata vice veris et Favoni
trahuntque siccas machinae carinas"
  />

  <AcvDrawer
    v-model="isDrawerTopShown"
    anchor="top"
    title="CARPE DIEM, SESTIUS"
    subtitle="Solvitur acris hiems grata vice veris et Favoni
trahuntque siccas machinae carinas"
  />

  <AcvDrawer
    v-model="isDrawerBottomShown"
    anchor="bottom"
    title="CARPE DIEM, SESTIUS"
    subtitle="Solvitur acris hiems grata vice veris et Favoni
trahuntque siccas machinae carinas"
  />
</template>
