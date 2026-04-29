import allPosts from "../ai_developments_2026.json";

/**
 * Returns a paginated slice of the local JSON data.
 * Each item already contains: id, title, body, source, email, date.
 */
export async function fetchPosts(start = 0, limit = 10) {
  const slice = allPosts.slice(start, start + limit);
  return slice;
}

/**
 * Not needed with local data (email is already on each post),
 * kept for compatibility in case it is imported elsewhere.
 */
export async function fetchUser(userId) {
  const post = allPosts.find((p) => p.id === userId);
  return post ? { email: post.email } : { email: "unknown@example.com" };
}