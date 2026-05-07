import * as React from "react";
import { fetchPosts } from "../../../api/posts";
import { PAGE_SIZE } from "../../../constants/config";
import { usePaginatedFetch } from "../../../hooks/usePaginatedFetch";
import type { Article } from "../../../types";

interface UsePostsReturn {
  posts: Article[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

export const usePosts = (userId?: string, limit: number = PAGE_SIZE): UsePostsReturn => {
  const fetcher = React.useCallback(
    async (page: number, lim: number) => {
      const items = await fetchPosts(page, lim, userId);
      return { items, hasMore: items.length === lim };
    },
    [userId]
  );

  const result = usePaginatedFetch<Article>(fetcher, limit);

  return { 
    posts: result.items, 
    loading: result.loading, 
    error: result.error, 
    hasMore: result.hasMore, 
    loadMore: result.loadMore 
  };
};
