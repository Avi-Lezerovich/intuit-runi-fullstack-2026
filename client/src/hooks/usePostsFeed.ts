/** Home feed data layer: posts list, sort tab, pagination, and optimistic local mutations. */
import { useState, useEffect, useCallback } from "react";
import { fetchPosts } from "../api";
import type { Post, Sort } from "../types";

/** Page size for both initial load and "load more". Keep aligned with the server's default. */
const PAGE_SIZE = 10;

/**
 * Owner of the home feed's data: the post list, current sort tab, pagination cursor,
 * loading/error state, and helpers the page uses to react to deletes and votes.
 *
 * `removePostFromState` / `updateVotesInState` are exposed so child components
 * (SinglePost, ConfirmDialog) can update the feed optimistically without forcing a refetch.
 *
 * `reload` triggers a fresh fetch (used by the "try again" button on errors).
 */
export const usePostsFeed = (initialSort: Sort = "hot") => {
  const [sort, setSort] = useState<Sort>(initialSort);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    // `cancelled` is a race-condition guard: if the user switches sort tabs while a
    // fetch is in-flight, the cleanup function flips this to `true` and we ignore
    // the stale response when it eventually resolves. This is the standard fetch-in-
    // useEffect pattern; the same idiom appears in useProfileData and useUsersList.
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPosts([]);
    setHasMore(true);

    fetchPosts({ sort, limit: PAGE_SIZE, offset: 0 })
      .then((data) => {
        if (cancelled) return;
        setPosts(data);
        setHasMore(data.length === PAGE_SIZE);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [sort, reloadKey]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = await fetchPosts({ sort, limit: PAGE_SIZE, offset: posts.length });
      setPosts((prev) => [...prev, ...next]);
      setHasMore(next.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בטעינת תביעות");
    } finally {
      setLoadingMore(false);
    }
  }, [posts.length, sort, loadingMore, hasMore]);

  // Optimistic local mutations — let the UI react instantly to user actions
  // without round-tripping through a fresh fetchPosts call.
  const removePostFromState = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const updateVotesInState = (postId: number, guilty: number, innocent: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, guilty_votes: guilty, innocent_votes: innocent } : p))
    );
  };

  return {
    sort, setSort,
    posts, loading, loadingMore, hasMore, error,
    reload, loadMore, removePostFromState, updateVotesInState,
  };
};
