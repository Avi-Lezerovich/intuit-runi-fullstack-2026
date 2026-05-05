import * as React from "react";
import { searchUsers } from "../../../api/users";
import { PAGE_SIZE } from "../../../constants/config";
import type { User } from "./useUsers";

const SEARCH_SCAN_MAX_PAGES = 5;

export const useUserSearch = (query: string, limit: number = PAGE_SIZE) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setUsers([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;
    setUsers([]);

    const runSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await searchUsers(trimmedQuery, {
          limit,
          maxPages: SEARCH_SCAN_MAX_PAGES,
        });

        if (!isActive) {
          return;
        }

        setUsers(result.users);
      } catch (err) {
        if (!isActive) {
          return;
        }

        setUsers([]);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    runSearch();

    return () => {
      isActive = false;
    };
  }, [query, limit]);

  return { users, loading, error };
};