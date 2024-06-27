<script setup lang="ts">
  import { ref, watch } from 'vue';

  // import { UiNotificationProvider, UiNotification } from '@acronis-platform/ui-component-library';
  import AcronisIconLarge from '../vue/acronis/monocolor/AcronisIconLarge.vue';
  // import ConstructorShortColorMainLogo from '@acronis-platform/icons/ConstructorShortColorMain.vue'
  import ConstructorShortColorMain from '../vue/constructor/logo/ConstructorShortColorMain.vue';
  import VLogoLarge from '../vue/acronis/v/VLogoLarge.vue';
  import type { IconType } from './types';
  import type { IconCollection } from './types/icon-collections.ts';
  import Gallery from './components/Gallery.vue';
  import Search from './components/Search.vue';

  const selectedCollection = ref<IconCollection>(
    (sessionStorage.getItem('iconCollection') as IconCollection) || 'acronis',
  );
  const selectedType = ref<IconType>(
    (sessionStorage.getItem('iconType') as IconType) || '',
  );
  const searchText = ref('');

  watch(
    [selectedCollection],
    () => {
      selectedType.value = '';
    },
    { deep: true },
  );
</script>

<template>
  <header>
    <AcronisIconLarge
      v-if="selectedCollection === 'acronis'"
      class="logo"
      alt="UI Kit Logo"
    />
    <ConstructorShortColorMain
      v-else-if="selectedCollection === 'constructor'"
      class="logo"
    />
    <VLogoLarge
      v-else
      class="logo"
    />
    <Search
      v-model:search="searchText"
      v-model:collection="selectedCollection"
      v-model:type="selectedType"
    />
  </header>

  <main>
    <KeepAlive>
      <Gallery
        :type="selectedType"
        :collection="selectedCollection"
        :search="searchText"
      />
    </KeepAlive>
  </main>

<!--  TODO use Notification service -->
<!--  <UiNotificationProvider v-slot="item"> -->
<!--    <UiNotifications -->
<!--      :item="item" -->
<!--      :theme="materialTheme" -->
<!--    /> -->
<!--  </UiNotificationProvider> -->
</template>

<style scoped>
main {
  margin: 0 auto;
  max-width: 1440px;
  padding: 16px 0;
}

header {
  margin: 32px auto;
  display: flex;
  gap: 32px;
  align-items: center;
  justify-content: center;
}

.logo {
  display: none;
}

@media screen and (width >= 720px) {
  .logo {
    display: inline-block;
    max-width: 64px;
  }
}

[v-cloak] {
  display: none;
}
</style>
