import { computed, ref } from 'vue';
import type { LocationQueryRaw } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';

export type AcvPaginationService = ReturnType<typeof useAcvPagination>;

export interface AcvPaginationState {
  limit: number
  offset?: number
}

export interface PaginationConfig { limit: number }

export function useAcvPagination({ limit = 50 }: PaginationConfig) {
  const router = useRouter();
  const route = useRoute();
  const total = ref(0);
  const page = computed(() => (route.query.page ? +route.query.page : 1));
  const lastPage = computed(() => Math.ceil(total.value / limit));
  const offset = computed(() => (page.value - 1) * limit);
  const lastItem = computed(() => Math.min(offset.value + limit, total.value));
  const state = computed(() => getState());
  const hasSecondPage = computed(() => lastPage.value >= 2);

  return {
    offset,
    hasSecondPage,
    state,
    page,
    lastItem,
    lastPage,
    total,
    setTotal,
    setPage,
  };

  async function setPage(newPage: number) {
    await router.push({ query: getPaginationQuery(route.query, newPage) });
  }

  function setTotal(newTotal: number) {
    total.value = newTotal;
  }

  function getState(): AcvPaginationState {
    // don't send 0 offset to backend
    return offset.value <= 0 ? { limit } : { limit, offset: offset.value };
  }
}

/**
 * Merge existing query with pagination params
 */
export function getPaginationQuery(query: LocationQueryRaw, page: number): LocationQueryRaw {
  // don't show first page in url
  return { ...query, page: page > 1 ? page : undefined };
}
