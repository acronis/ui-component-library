<script setup>
  import { ref } from 'vue';
  import { IconButton } from '@ui-kit/figma-ds-vue-plugin';
  import '@ui-kit/figma-ds-vue-plugin/dist/figma-ds-vue-plugin.css';
  import Loading from './Loading.vue';
  import Variables from './Variables.vue';
  import Components from './Components.vue';
  import TextStyles from './TextStyles.vue';
  import Effects from './Effects.vue';
  import Sync from './Sync.vue';
  import Grids from './Grids.vue';
  import Settings from './Settings.vue';
  import Stats from './Stats.vue';

  const frameTitleMap = {
    variables: 'Variables',
    components: 'Components',
    text: 'Text styles',
    effects: 'Effects',
    grids: 'Grids',
    sync: 'Sync',
    settings: 'Settings',
    stats: 'Stats',
  };
  const isLoading = ref(false);
  const tab = ref('variables');
</script>

<template>
  <div class="figma-tokens">
    <header>
      <h4 class="title">
        {{ frameTitleMap[tab] }}
      </h4>
      <!--      <span class="navigation"> -->
      <!--        {{ tab }} -->
      <!--      </span> -->
      <span class="settings">
        <IconButton
          icon="settings"
          title="Settings"
          @click="tab = 'settings'"
        ></IconButton>
      </span>
    </header>
    <main>
      <Loading v-if="isLoading" />
      <Variables v-else-if="tab === 'variables'" />
      <Components v-else-if="tab === 'components'" />
      <TextStyles v-else-if="tab === 'text'" />
      <Effects v-else-if="tab === 'effects'" />
      <Grids v-else-if="tab === 'grids'" />
      <Sync
        v-else-if="tab === 'sync'"
        v-model:isLoading="isLoading"
      />
      <Settings v-else-if="tab === 'settings'" />
      <Stats
        v-else-if="tab === 'stats'"
      />
    </main>
    <footer>
      <ul class="feature-selector">
        <li>
          <IconButton
            icon="styles"
            title="Variables"
            :selected="tab === 'variables'"
            @click="tab = 'variables'"
          ></IconButton>
        </li>
        <li>
          <IconButton
            icon="component"
            title="Components"
            :selected="tab === 'components'"
            @click="tab = 'components'"
          ></IconButton>
        </li>
        <li>
          <IconButton
            icon="theme"
            title="Text styles"
            :selected="tab === 'text'"
            @click="tab = 'text'"
          ></IconButton>
        </li>
        <li>
          <IconButton
            icon="effects"
            title="Effects"
            :selected="tab === 'effects'"
            @click="tab = 'effects'"
          ></IconButton>
        </li>
        <li>
          <IconButton
            icon="list"
            title="Grids"
            :selected="tab === 'grids'"
            @click="tab = 'grids'"
          ></IconButton>
        </li>
        <li>
          <IconButton
            icon="resolve"
            title="Sync"
            :selected="tab === 'sync'"
            @click="tab = 'sync'"
          ></IconButton>
        </li>
        <li>
          <IconButton
            icon="library"
            title="Stats"
            :selected="tab === 'stats'"
            @click="tab = 'stats'"
          ></IconButton>
        </li>
      </ul>
    </footer>
  </div>
</template>

<style scoped>
  .figma-tokens {
    min-height: 100%;
    display: grid;
    grid-template-rows: 40px 1fr 50px;
    grid-row-gap: 10px;
    grid-template-areas:
          "header"
          "main"
          "footer";
  }

  header {
    grid-area: header;
    background-color: var(--figma-color-bg);
    display: grid;
    position: fixed;
    line-height: 40px;
    width: 100%;
    border-bottom: 1px solid var(--figma-color-border);
    grid-template-columns: 40% 1fr 32px;
    grid-template-areas: "title navigation settings";

    .title {
      grid-area: title;
      margin: 0;
      padding: 0;
      text-align: left;
      padding-left: 20px;
      line-height: 40px;
    }

    .navigation {
      grid-area: navigation;
      text-align: center;
    }

    .settings {
      grid-area: settings;
      text-align: right;
      padding-right: 20px;
      align-self: center;
    }
  }

  main {
    grid-area: main;
    background-color: var(--figma-color-bg);
    border-radius: 10px;
  }

  footer {
    grid-area: footer;
    background-color: var(--figma-color-bg);
    height: 50px;
  }

  textarea {
    width: 100%;
    height: 100px;
  }

  .feature-selector {
    width: 100%;
    list-style-type: none;
    padding: 0;
    display: block;
    overflow: hidden;
    margin: 0;

    li {
      float: left;
      padding: 0.5rem;
      background-color: hsl(0deg, 0%, 98%);
      border: 1px solid hsl(0deg, 0%, 91%);
      white-space: nowrap;
      overflow: hidden;

      &:hover {
        background-color: hsl(0deg, 0%, 94%);
      }
    }
  }
</style>
