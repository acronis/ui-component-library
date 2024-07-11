import { type Raw, computed, markRaw, ref, watch } from 'vue';
import * as acronisCollection from '@acronis-platform/icons/src/acronis';

export function useIcons({ collection, type = '', search = '' }) {
  const iconNames = ref<string[]>([]);
  const icons = ref<Raw<[string, unknown][]>>([]);

  watch(
    [() => collection, () => type],
    () => {
      try {
        iconNames.value = Object.keys(acronisCollection);
        icons.value = markRaw(Object.entries(acronisCollection));
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
    if (search === '') {
      return icons.value;
    }

    const searchText = search.trim().replace(/\s+/g, '_').toLowerCase();
    return icons.value.filter(([iconName]) => iconName.includes(searchText));
  });

  return {
    displayIcons,
    iconNames,
    icons,
  };
}
