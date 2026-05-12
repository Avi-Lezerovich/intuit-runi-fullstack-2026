import { useState, useEffect } from "react";
import { fetchUsers } from "../api";
import type { UserListItem } from "../types";

const PAGE_SIZE = 10;

export const useUsersList = (debouncedSearch: string) => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setUsers([]);
    setHasMore(true);

    fetchUsers({ search: debouncedSearch, limit: PAGE_SIZE, offset: 0 })
      .then((data) => {
        if (cancelled) return;
        setUsers(data);
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
  }, [debouncedSearch]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = await fetchUsers({
        search: debouncedSearch,
        limit: PAGE_SIZE,
        offset: users.length,
      });
      setUsers((prev) => [...prev, ...next]);
      setHasMore(next.length === PAGE_SIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בטעינת נתונים נוספים");
    } finally {
      setLoadingMore(false);
    }
  };

  return { users, loading, loadingMore, hasMore, error, loadMore };
};