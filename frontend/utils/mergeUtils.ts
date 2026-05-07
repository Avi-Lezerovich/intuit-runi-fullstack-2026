/**
 * Generic utility to merge two arrays while filtering duplicates by ID.
 * Keeps the list stable if the same data is fetched twice (e.g., React StrictMode).
 * @param previousItems - The existing array of items
 * @param incomingItems - The new items to merge
 * @param idKey - The property name used as unique identifier (default: 'id')
 * @returns Merged array with duplicates removed
 */
export const mergeUniqueItems = <T, K extends keyof T>(
  previousItems: T[],
  incomingItems: T[],
  idKey: K = "id" as unknown as K
): T[] => {
  const seenIds = new Set(previousItems.map((item) => item[idKey]));
  const uniqueIncomingItems = incomingItems.filter((item) => !seenIds.has(item[idKey]));
  return [...previousItems, ...uniqueIncomingItems];
};
