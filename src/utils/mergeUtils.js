/**
 * Generic utility to merge two arrays while filtering duplicates by ID.
 * Keeps the list stable if the same data is fetched twice (e.g., React StrictMode).
 * @param {array} previousItems - The existing array of items
 * @param {array} incomingItems - The new items to merge
 * @param {string} idKey - The property name used as unique identifier (default: 'id')
 * @returns {array} Merged array with duplicates removed
 */
export const mergeUniqueItems = (previousItems, incomingItems, idKey = "id") => {
  const seenIds = new Set(previousItems.map((item) => item[idKey]));
  const uniqueIncomingItems = incomingItems.filter((item) => !seenIds.has(item[idKey]));
  return [...previousItems, ...uniqueIncomingItems];
};
