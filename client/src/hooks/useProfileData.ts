import { useState, useEffect } from "react";
import { fetchUserProfile } from "../api";
import type { Post, User, UserStats } from "../types";

/** Number of posts to reveal at a time when the user clicks "load more". */
const PAGE_SIZE = 10;

/**
 * Owner of all data on the ProfilePage route: the user record, the aggregated stats,
 * the full post list, and a "visible window" cursor for client-side pagination.
 *
 * Unlike usePostsFeed which paginates against the server, this hook fetches all of the
 * user's posts upfront (they're rarely numerous) and reveals them PAGE_SIZE at a time
 * from local memory. That keeps stats accurate without re-fetching after each delete.
 */
export const useProfileData = (numericUserId: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(numericUserId)) {
      setError("מזהה תובע לא תקין");
      setLoading(false);
      return;
    }

    // Same race-condition guard pattern as usePostsFeed — see that file for details.
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchUserProfile(numericUserId)
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        setStats(data.stats);
        setAllPosts(data.posts);
        setVisibleCount(PAGE_SIZE);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "שגיאה לא ידועה");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [numericUserId]);

  const loadMore = () => setVisibleCount((n) => n + PAGE_SIZE);

  /**
   * Optimistic delete + stats recompute. Since the API doesn't return a verdict flag,
   * we infer it from the post's current vote ratio (more guilty than innocent → guilty).
   * It's not exact (the post might have been mid-vote when deleted) but it keeps the
   * stats row believable until the next full refetch.
   */
  const removePostFromState = (deletedPost: Post) => {
    setAllPosts((prev) => prev.filter((p) => p.id !== deletedPost.id));
    setStats((s) => {
      if (!s) return s;
      const wasGuilty = deletedPost.guilty_votes > deletedPost.innocent_votes;
      const total = Math.max(0, s.total - 1);
      const guilty = Math.max(0, s.guilty - (wasGuilty ? 1 : 0));
      const innocent = Math.max(0, s.innocent - (wasGuilty ? 0 : 1));
      const success_percent = total ? Math.round((guilty / total) * 100) : 0;
      return { total, guilty, innocent, success_percent };
    });
  };

  const updateVotesInState = (postId: number, guilty: number, innocent: number) => {
    setAllPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, guilty_votes: guilty, innocent_votes: innocent } : p))
    );
  };

  return {
    user,
    stats,
    visiblePosts: allPosts.slice(0, visibleCount),
    hasMore: visibleCount < allPosts.length,
    loading,
    error,
    loadMore,
    removePostFromState,
    updateVotesInState,
  };
};
