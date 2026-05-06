import { useCallback, useEffect, useState } from "react";
import { mergeUniqueItems } from "../utils/mergeUtils";
import { PAGE_SIZE } from "../constants/config";

interface PageResult<T> {
  items: T[];
  hasMore: boolean;
}

type Fetcher<T> = (page: number, limit: number) => Promise<PageResult<T>>;

export const usePaginatedFetch = <T extends { id: number | string }>(
  fetcher: Fetcher<T>,
  limit: number = PAGE_SIZE
) => {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(
    async (p: number, isActive: () => boolean) => {
      setLoading(true);
      setError(null);
      try {
        const { items: newItems, hasMore: more } = await fetcher(p, limit);
        if (!isActive()) return;
        setItems((prev) =>
          p === 1 ? newItems : mergeUniqueItems(prev, newItems, "id")
        );
        setHasMore(more);
      } catch (err) {
        if (isActive()) {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        if (isActive()) setLoading(false);
      }
    },
    [fetcher, limit]
  );

  useEffect(() => {
    let active = true;
    loadPage(1, () => active);
    return () => {
      active = false;
    };
  }, [loadPage]);

  const loadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    let active = true;
    loadPage(next, () => active);
  }, [page, loadPage]);

  return { items, loading, error, hasMore, loadMore };
};
