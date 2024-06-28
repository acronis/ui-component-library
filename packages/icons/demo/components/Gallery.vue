<script lang="ts" setup>
  import type { Raw } from 'vue';
  import { computed, markRaw, ref, watch } from 'vue';
  import useClipboard from 'vue-clipboard3';
  import type { IconType } from '../types';
  import { rename } from '../utils';

  // import { push } from '../main';
  import type { IconCollection } from '../types/icon-collections.ts';
  import IconButton from './IconButton.vue';

  const props = withDefaults(defineProps<{
    type: IconType
    search: string
    collection: IconCollection
  }>(), {
    type: '',
    search: '',
    collection: 'acronis',
  });
  const iconNames = ref<string[]>([]);
  const icons = ref<Raw<[string, unknown][]>>([]);

  watch(
    [() => props.collection, () => props.type],
    () => {
      try {
        import(['../../vue', props.collection, props.type, 'public.ts'].join('/')).then((module) => {
          iconNames.value = Object.keys(module);
          icons.value = markRaw(Object.entries(module));
        });
      }
      catch (err) {
        icons.value = [];
        iconNames.value = [];
        console.error(err);
      }
    },
    { immediate: true },
  );

  const displayIcons = computed(() => {
    if (props.search === '') {
      return icons.value;
    }

    const searchText = props.search.trim().replace(/\s+/g, '_').toLowerCase();
    return icons.value.filter(([iconName]) => iconName.includes(searchText));
  });

  const { toClipboard } = useClipboard();

  async function copy(text: string) {
    const iconName = rename(`${text}_${props.type}`);
    const str = `import ${iconName} from '@acronis-platform/icons/${iconName}'`;

    toClipboard(str).then(() => {
      // TODO show UiNotification/Toast
      // push.success({
      //   title: `<${iconName} />`,
      //   message: 'Copied import statement to clipboard',
      // });
    }).catch((err) => {
      console.error(err);
    });
  }
</script>

<template>
  <div class="gallery-container">
    <IconButton
      v-for="icon in displayIcons"
      :key="icon[0]"
      :type="props.type"
      :name="icon[0]"
      :icon="icon[1]"
      @click="copy(icon[0])"
    >
      {{ icon }}
    </IconButton>
  </div>
</template>

<style>
.gallery-container {
  display: grid;
  flex-wrap: wrap;
  justify-content: center;
  gap: 26px 16px;
  grid-template-columns: repeat(auto-fill, 128px);
}

@media screen and (width >= 720px) {
  .gallery-container {
    grid-template-columns: repeat(auto-fill, 112px);
  }
}
</style>
