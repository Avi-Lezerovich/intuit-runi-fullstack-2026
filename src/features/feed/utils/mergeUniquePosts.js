// Merge new posts into the current list while skipping duplicate ids.
// Keeps the feed stable if the same page is fetched twice (e.g. React StrictMode).

export const mergeUniquePosts = (previousPosts, incomingPosts) => {
  const seenIds = new Set(previousPosts.map((post) => post.id));
  const uniqueIncomingPosts = incomingPosts.filter((post) => !seenIds.has(post.id));
  return [...previousPosts, ...uniqueIncomingPosts];
};
