import { useEffect, useState, useCallback } from "react";
import { fetchPosts } from "../../../api/posts";
import { PAGE_SIZE } from "../../../constants/config";
import { mergeUniquePosts } from "../utils/mergeUniquePosts";
import type { Article } from "../../../types";

interface UsePostsReturn {
  posts: Article[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

// Encapsulates the feed data lifecycle: initial load, pagination, error state.
// Returning a clean { posts, loading, error, hasMore, loadMore } object lets
// the Feed component stay purely presentational.
export const usePosts = (limit: number = PAGE_SIZE): UsePostsReturn => {
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPage = useCallback(
    async (pageNumber: number) => {
      setLoading(true);
      setError(null);
      try {
        const newPosts = await fetchPosts(pageNumber, limit);
        if (newPosts.length < limit) setHasMore(false);
        setPosts((prev) => mergeUniquePosts(prev, newPosts));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Initial fetch on mount.
  useEffect(() => {
    let isActive = true;

    const loadInitialPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const newPosts = await fetchPosts(1, limit);

        if (!isActive) return;

        if (newPosts.length < limit) setHasMore(false);
        setPosts(newPosts);
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadInitialPage();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage);
  };

  return { posts, loading, error, hasMore, loadMore };
};
