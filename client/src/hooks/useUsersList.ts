import { useState, useEffect } from "react";
import { fetchUsers } from "../api";
import type { UserListItem } from "../types";

/** Page size for both initial load and "load more". Keep aligned with the server's default. */
const PAGE_SIZE = 10;

/**
 * Owner of the Users page's data: the list, search filter (debounced upstream),
 * pagination cursor, and loading/error state.
 *
 * The page passes the already-debounced search term in via the `debouncedSearch` arg,
 * so this hook re-fetches whenever the user pauses typing — never per keystroke.
 */
export const useUsersList = (debouncedSearch: string) => {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Same race-condition guard pattern as usePostsFeed — see that file for details.
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
