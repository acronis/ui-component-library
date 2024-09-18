<script setup>
  import { AcvAside, AcvContainer, AcvFooter, AcvHeader, AcvMain } from '@acronis-platform/ui-component-library';
</script>

<template>
  <AcvContainer>
    <AcvHeader :bordered="false">
      <template #aside>
        <span class="centered">Header</span>
      </template>
    </AcvHeader>
    <AcvMain>Main</AcvMain>
  </AcvContainer>

  <AcvContainer>
    <AcvHeader :bordered="false">
      <template #aside>
        <span class="centered">Header</span>
      </template>
    </AcvHeader>
    <AcvMain>Main</AcvMain>
    <AcvFooter>Footer</AcvFooter>
  </AcvContainer>

  <AcvContainer>
    <AcvAside width="200">
      Aside
    </AcvAside>
    <AcvMain>Main</AcvMain>
  </AcvContainer>

  <AcvContainer class="qa-layout-container-сommon">
    <AcvHeader :bordered="false">
      <template #aside>
        <span class="centered">Header</span>
      </template>
    </AcvHeader>
    <AcvContainer>
      <AcvAside width="200">
        Aside
      </AcvAside>
      <Main>Main</Main>
    </AcvContainer>
  </AcvContainer>

  <AcvContainer>
    <AcvHeader :bordered="false">
      <template #aside>
        <span class="centered">Header</span>
      </template>
    </AcvHeader>
    <AcvContainer>
      <AcvAside width="200">
        Aside
      </AcvAside>
      <AcvContainer>
        <AcvMain>Main</AcvMain>
        <AcvFooter>Footer</AcvFooter>
      </AcvContainer>
    </AcvContainer>
  </AcvContainer>

  <AcvContainer>
    <AcvAside width="200">
      Aside
    </AcvAside>
    <AcvContainer>
      <AcvHeader :bordered="false">
        <template #aside>
          <span class="centered">Header</span>
        </template>
      </AcvHeader>
      <AcvMain>Main</AcvMain>
    </AcvContainer>
  </AcvContainer>

  <AcvContainer class="qa-layout-container-with-header-and-footer">
    <AcvAside width="200">
      Aside
    </AcvAside>
    <AcvContainer>
      <AcvHeader :bordered="false">
        <template #aside>
          <span class="centered">Header</span>
        </template>
      </AcvHeader>
      <AcvMain>Main</AcvMain>
      <AcvFooter>Footer</AcvFooter>
    </AcvContainer>
  </AcvContainer>
</template>

<style scoped>
.ui-header, .ui-footer {
  background-color: var(--acv-color-accent);
  color: var(--acv-color-text-primary);
  text-align: center;
  line-height: 60px;
}

.ui-header {
  position: relative;
}

.ui-aside {
  background-color: var(--acv-color-bg-tertiary);
  color: var(--acv-color-text-primary);
  text-align: center;
  line-height: 200px;
}

.ui-main {
  background-color: var(--acv-color-bg-secondary);
  color: var(--acv-color-text-primary);
  text-align: center;
  line-height: 160px;
}

body > .ui-container {
  margin-bottom: 40px;
}

.ui-container:nth-child(5) .ui-aside,
.ui-container:nth-child(6) .ui-aside {
  line-height: 260px;
}

.ui-container:nth-child(7) .ui-aside {
  line-height: 320px;
}

.centered {
  position: absolute;
  inset: 0;
}
</style>
