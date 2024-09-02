import type { LocationQueryRaw } from 'vue-router';

/**
 * Merge existing query with pagination params
 */
export function getPaginationQuery(query: LocationQueryRaw, page: number): LocationQueryRaw {
  // don't show first page in url
  return { ...query, page: page > 1 ? page : undefined };
}
