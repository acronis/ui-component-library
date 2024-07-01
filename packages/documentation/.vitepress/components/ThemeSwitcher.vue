<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import acronisStyles from '@acronis-platform/ui-component-library/styles/acronis.css?raw';
  import constructorStyles from '@acronis-platform/ui-component-library/styles/constructor.css?raw';
  import { CSSStyleSheet } from 'cssom';

  type Theme = 'acronis' | 'constructor';

  const theme = ref<Theme>('acronis');
  const showList = ref(false);
  const themes: Record<Theme, string> = {
    acronis: acronisStyles,
    constructor: constructorStyles,
  };
  const themesSheet = new CSSStyleSheet();

  document.adoptedStyleSheets = [...document.adoptedStyleSheets, themesSheet];
  onBeforeMount(() => applyColors(theme.value));

  function toggleList() {
    showList.value = !showList.value;
  }

  function applyColors(themeName) {
    theme.value = themeName;
    themesSheet.replaceSync(themes[themeName]);
  }

  function changeTheme(themeName) {
    showList.value = false;
    applyColors(themeName);
  }
</script>

<template>
  <div class="theme-switcher">
    <div @click="toggleList">
      Change theme
    </div>
    <ul
      v-if="showList"
      class="theme-list"
    >
      <li
        :class="{ selected: theme === 'acronis' }"
        @click="changeTheme('acronis')"
      >
        Acronis
      </li>
      <li
        :class="{ selected: theme === 'constructor' }"
        @click="changeTheme('constructor')"
      >
        Constructor
      </li>
    </ul>
  </div>
</template>

<style scoped>
.theme-switcher {
  position: relative;
  line-height: 24px;
  padding: 0 14px;
  border-left: 1px solid var(--vp-c-divider);
  margin: 6px 14px;
  cursor: pointer;
}

.theme-list {
  position: absolute;
  padding: 8px;
  top: 100%;
  background-color: var(--acv-color-white);
  border: 1px solid var(--acv-color-grey-light-20);

  li {
    padding: 8px;
    cursor: pointer;
    min-width: 160px;
    text-overflow: ellipsis;
  }

  li:hover {
    background-color: rgba(127, 127, 127, 0.38);
  }

  li.selected {
    background-color: var(--acv-color-primary-lighter);
  }
}
</style>
