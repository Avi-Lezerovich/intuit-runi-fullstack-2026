// Merge new posts into the current list while skipping duplicate ids.
// Keeps the feed stable if the same page is fetched twice (e.g. React StrictMode).

import { mergeUniqueItems } from "../../../utils/mergeUtils";

export const mergeUniquePosts = (previousPosts, incomingPosts) => {
  return mergeUniqueItems(previousPosts, incomingPosts, "id");
};
