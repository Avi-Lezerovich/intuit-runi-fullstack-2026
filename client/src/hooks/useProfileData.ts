import { useState, useEffect } from "react";
import { fetchUserProfile } from "../api";
import type { Post, User, UserStats } from "../types";

const PAGE_SIZE = 10;

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

  // לוגיקה לחישוב מחדש של הסטטיסטיקות (מנותק מה-UI של המחיקה)
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