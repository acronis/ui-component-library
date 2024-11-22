<script setup>
  import ElButton from '@/components/button/button.vue';
  import ElIcon from '@/components/icon/icon.vue';
</script>

<script>
  export default {
    data() {
      return {
        iconState1: true,
        iconState2: true,
        iconState3: true,
        iconState4: true,
        fonts: [
          'el-text--display-large',
          'el-text--display-medium',
          'el-text--display-regular',
          'EL-TEXT--HEADING',
          'el-text--strong',
          'el-text--subheading',
          'el-text--body-24',
          'el-text--caption',
          'EL-TEXT--ACCENT'
        ]
      };
    }
  };
</script>

<template>
  <preview-group class="qa-icon-basic">
    <preview
      name="Default"
      span="6"
    >
      <ElIcon
        name="IconWorkstations32"
        color="brand-primary"
      />
    </preview>
    <preview
      name="Ghost button"
      span="6"
    >
      <ElButton variant="ghost">
        <ElIcon name="IconWorkstation16" />
      </ElButton>
    </preview>
    <preview
      name="Secondary button"
      span="6"
    >
      <ElButton
        variant="secondary"
        icon="IconWorkstationMix32"
      >
        Button
      </ElButton>
    </preview>
    <preview
      name="Primary button"
      span="6"
    >
      <ElButton icon="IconWorkstation16">
        Button
      </ElButton>
    </preview>
    <preview
      name="Multicolor icon"
      span="6"
    >
      <ElIcon
        name="IconSync32"
        size="medium"
      />
    </preview>
    <preview
      name="Colored"
      span="6"
    >
      <ElIcon
        name="IconWorkstation16"
        color="brand-primary"
        size="medium"
      />
    </preview>
  </preview-group>
</template>
