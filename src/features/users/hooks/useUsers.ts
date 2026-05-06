import * as React from "react";
import { fetchUsers } from "../../../api/users";
import { PAGE_SIZE } from "../../../constants/config";
import { usePaginatedFetch } from "../../../hooks/usePaginatedFetch";
import type { User } from "../../../types";

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

// Encapsulates the users data lifecycle for UsersPage.
export const useUsers = (limit: number = PAGE_SIZE): UseUsersReturn => {
  const fetcher = React.useCallback(
    async (page: number, lim: number) => {
      const fetchResult = await fetchUsers(page, lim);
      return { items: fetchResult.users, hasMore: fetchResult.hasMore };
    },
    []
  );

  const result = usePaginatedFetch<User>(fetcher, limit);

  return {
    users: result.items,
    loading: result.loading,
    error: result.error,
    hasMore: result.hasMore,
    loadMore: result.loadMore
  };
};
