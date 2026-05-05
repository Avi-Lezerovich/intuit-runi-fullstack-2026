// All user-related API calls live here.

import { apiFetch, apiFetchText } from "./client";
import { PAGE_SIZE, PROFILE_BASE_URL } from "../constants/config";
import { mergeUniqueUsers } from "../features/users/utils/mergeUniqueUsers";

// dev.to does not expose a post-count endpoint, so we scrape the profile page.
export const fetchUserPostCount = async (username) => {
  const html = await apiFetchText(`${PROFILE_BASE_URL}/${username}`);
  const match = html.match(/(\d+)\s+posts?\s+published/i);
  return match ? Number(match[1]) : 0;
};

// Fetches a page of articles, derives the unique authors, then enriches each
// with a post count. Returned shape: { users, hasMore }.
export const fetchUsers = async (page = 1, limit = PAGE_SIZE) => {
  const articles = await apiFetch(`/articles?page=${page}&per_page=${limit}`);

  const uniqueUsers = Object.values(
    articles.reduce((acc, article) => {
      const user = article.user;
      if (user && !acc[user.user_id]) {
        acc[user.user_id] = user;
      }
      return acc;
    }, {})
  );

  const users = await Promise.all(
    uniqueUsers.map(async (user) => ({
      id: user.user_id,
      name: user.name,
      username: user.username,
      profile_image: user.profile_image,
      profile_image_90: user.profile_image_90,
      post_count: await fetchUserPostCount(user.username),
    }))
  );

  return { users, hasMore: articles.length === limit };
};

// DEV.to does not expose a user search endpoint, so search by scanning a
// bounded number of article pages and deriving matching authors.
export const searchUsers = async (
  query,
  { limit = PAGE_SIZE, maxPages = 5 } = {}
) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return { users: [] };
  }

  let page = 1;
  let hasMore = true;
  let matchedUsers = [];

  while (hasMore && page <= maxPages) {
    const result = await fetchUsers(page, limit);

    const pageMatches = result.users.filter((user) => {
      const name = user.name?.toLowerCase() ?? "";
      const username = user.username?.toLowerCase() ?? "";
      return name.includes(normalizedQuery) || username.includes(normalizedQuery);
    });

    matchedUsers = mergeUniqueUsers(matchedUsers, pageMatches);
    hasMore = result.hasMore;
    page += 1;
  }

  return { users: matchedUsers };
};
