import * as React from "react";
import { fetchUsers } from "../../../api/users";
import { PAGE_SIZE } from "../../../constants/config";
import { mergeUniqueUsers } from "../utils/mergeUniqueUsers";

export interface User {
  id: number;
  name: string;
  username: string;
  profile_image_90: string;
  post_count: number;
}

// Encapsulates the users data lifecycle for UsersPage.
export const useUsers = (limit: number = PAGE_SIZE) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const loadPage = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUsers(pageNumber, limit);
      setHasMore(result.hasMore);
      setUsers((prev) => mergeUniqueUsers(prev, result.users));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage);
  };

  return { users, loading, error, hasMore, loadMore };
};
