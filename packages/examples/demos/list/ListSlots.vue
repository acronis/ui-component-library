<script setup>
  import AcvCard from '@/components/card/card.vue';
  import AcvInput from '@/components/input/input.vue';
  import AcvList from '@/components/list/list.vue';
  import { ref } from 'vue';

  const items = [
    { title: 'Donut jujubes' },
    { title: 'Sesame snaps' },
    { title: 'I love jelly' },
    { title: 'Cake gummi' },
  ];
  const summaryItems = ref([{ subtitle: '4 items found' }]);
</script>

<template>
  <AcvCard>
    <AcvList
      v-model="items"
    >
      <!-- Slot: Before -->
      <template #before>
        <AcvInput class="my-2 mx-4" />
      </template>

      <!-- Slot: Append -->
      <!--
        ℹ️ If you want to access index you have to make slotProps as any as shown below.
        This will get resolved as soon as Vue supports short syntax for `defineSlots()`.
      -->
      <template #item-append="slotProps">
        <span class="kbd">
          &#8984; {{ (slotProps).index + 1 }}
        </span>
      </template>

      <!-- Slot: After -->
      <template #after>
        <hr class="my-2">
        <AcvList
          v-model="summaryItems"
          class="my-0 opacity-75"
        />
      </template>
    </AcvList>
  </AcvCard>
</template>
