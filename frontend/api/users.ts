// All user-related API calls live here.

import { apiFetch } from "./client";
import { PAGE_SIZE } from "../constants/config";
import { mergeUniqueItems } from "../utils/mergeUtils";
import type { Article, User, FetchUsersResult } from "../types";

const postCountCache = new Map<string, number>();

export const fetchUserPostCount = async (username: string): Promise<number> => {
  if (postCountCache.has(username)) {
    return postCountCache.get(username)!;
  }
  try {
    // We fetch a high number of articles for this user to get a count.
    const articles = await apiFetch<Article[]>(`/articles?username=${username}&per_page=1000`);
    const count = articles.length;
    postCountCache.set(username, count);
    return count;
  } catch {
    postCountCache.set(username, 0);
    return 0;
  }
};

// Fetches a page of articles, derives the unique authors, then enriches each
// with a post count. Returned shape: { users, hasMore }.
export const fetchUsers = async (
  page = 1,
  limit = PAGE_SIZE
): Promise<FetchUsersResult> => {
  const articles = await apiFetch<Article[]>(`/articles?page=${page}&per_page=${limit}`);

  const uniqueUsers = Object.values(
    articles.reduce<Record<number, Article["user"]>>((acc, article) => {
      const user = article.user;
      if (user && !acc[user.user_id]) {
        acc[user.user_id] = user;
      }
      return acc;
    }, {})
  );

  const users: User[] = await Promise.all(
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
  query: string,
  { limit = PAGE_SIZE, maxPages = 5 } = {}
): Promise<{ users: User[] }> => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return { users: [] };
  }

  let page = 1;
  let hasMore = true;
  let matchedUsers: User[] = [];

  while (hasMore && page <= maxPages) {
    const result = await fetchUsers(page, limit);

    const pageMatches = result.users.filter((user) => {
      const name = user.name?.toLowerCase() ?? "";
      const username = user.username?.toLowerCase() ?? "";
      return name.includes(normalizedQuery) || username.includes(normalizedQuery);
    });

    matchedUsers = mergeUniqueItems(matchedUsers, pageMatches, "id");
    hasMore = result.hasMore;
    page += 1;
  }

  return { users: matchedUsers };
};
