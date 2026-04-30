import allPosts from "../ai_developments_2026.json";

/**
 * Returns a paginated slice of the local JSON data.
 * Each item already contains: id, title, body, source, email, date.
 */
// export async function fetchPosts(start = 0, limit = 10) {
//   const slice = allPosts.slice(start, start + limit);
//   return slice;
// }

export const fetchPosts = (page = 1, limit = 10) => {
  return fetch(`https://dev.to/api/articles?page=${page}&per_page=${limit}`)
    .then((res) => res.json());
};
