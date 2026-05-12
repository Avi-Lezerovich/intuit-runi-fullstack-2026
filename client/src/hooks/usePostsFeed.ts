import { useState, useEffect, useCallback } from "react";
import { fetchPosts } from "../api";
import type { Post, Sort } from "../types";

const PAGE_SIZE = 10;

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

  // פונקציות לעדכון המצב המקומי אחרי פעולות משתמש
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