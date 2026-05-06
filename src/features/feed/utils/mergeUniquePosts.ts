// Merge new posts into the current list while skipping duplicate ids.
// Keeps the feed stable if the same page is fetched twice (e.g. React StrictMode).

import { mergeUniqueItems } from "../../../utils/mergeUtils";
import type { Article } from "../../../types";

export const mergeUniquePosts = (
  previousPosts: Article[],
  incomingPosts: Article[]
): Article[] => {
  return mergeUniqueItems(previousPosts, incomingPosts, "id");
};
