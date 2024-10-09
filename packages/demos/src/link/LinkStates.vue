<script setup>
  import AcvLink from '@/components/link/link.vue';
  import { IconArrowLeft16, IconArrowRight16 } from '@acronis-platform/icons/arrow';

  function handleClick() {
    console.log('Link is clicked');
  }

  const linkStates = [
    'default',
    'hover',
    'active',
    'focus',
    'disabled',
  ];
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-6">
    <span>---</span>
    <h3>Default</h3>
    <h3>Hover</h3>
    <h3>Active</h3>
    <h3>Focus</h3>
    <h3>Disabled</h3>

    <h3>Default</h3>
    <div
      v-for="state in linkStates"
      :key="state"
    >
      <AcvLink
        :class="state"
        @click="handleClick"
      >
        Link
      </AcvLink>
    </div>

    <h3>Icon on the left side</h3>
    <div
      v-for="state in linkStates"
      :key="state"
    >
      <IconArrowLeft16 />
      <AcvLink
        :class="state"
        @click="handleClick"
      >
        Link
      </AcvLink>
    </div>

    <h3>Icon on the right side</h3>
    <div
      v-for="state in linkStates"
      :key="state"
    >
      <AcvLink
        :class="state"
        @click="handleClick"
      >
        Link
      </AcvLink>
      <IconArrowRight16 />
    </div>

    <h3>Icons on both sides</h3>
    <div
      v-for="state in linkStates"
      :key="state"
    >
      <IconArrowLeft16 />
      <AcvLink
        :class="state"
        @click="handleClick"
      >
        Link
      </AcvLink>
      <IconArrowRight16 />
    </div>
  </div>
</template>
