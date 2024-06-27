<script setup>
  import { Aside, Container, Footer, Header, Main } from '@acronis-platform/ui-component-library';
</script>

<template>
  <Container>
    <Header :bordered="false">
      <template #aside>
        <span class="centered">Header</span>
      </template>
    </Header>
    <Main>Main</Main>
  </Container>

  <Container>
    <Header :bordered="false">
      <template #aside>
        <span class="centered">Header</span>
      </template>
    </Header>
    <Main>Main</Main>
    <Footer>Footer</Footer>
  </Container>

  <Container>
    <Aside width="200">
      Aside
    </Aside>
    <Main>Main</Main>
  </Container>

  <Container class="qa-layout-container-сommon">
    <Header :bordered="false">
      <template #aside>
        <span class="centered">Header</span>
      </template>
    </Header>
    <Container>
      <Aside width="200">
        Aside
      </Aside>
      <Main>Main</Main>
    </Container>
  </Container>

  <Container>
    <Header :bordered="false">
      <template #aside>
        <span class="centered">Header</span>
      </template>
    </Header>
    <Container>
      <Aside width="200">
        Aside
      </Aside>
      <Container>
        <Main>Main</Main>
        <Footer>Footer</Footer>
      </Container>
    </Container>
  </Container>

  <Container>
    <Aside width="200">
      Aside
    </Aside>
    <Container>
      <Header :bordered="false">
        <template #aside>
          <span class="centered">Header</span>
        </template>
      </Header>
      <Main>Main</Main>
    </Container>
  </Container>

  <Container class="qa-layout-container-with-header-and-footer">
    <Aside width="200">
      Aside
    </Aside>
    <Container>
      <Header :bordered="false">
        <template #aside>
          <span class="centered">Header</span>
        </template>
      </Header>
      <Main>Main</Main>
      <Footer>Footer</Footer>
    </Container>
  </Container>
</template>

<style>
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
