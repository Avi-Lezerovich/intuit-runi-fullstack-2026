import { useEffect, useState } from "react";
import { fetchPosts } from "../../../api/posts";
import { PAGE_SIZE } from "../../../constants/config";
import { mergeUniquePosts } from "../utils/mergeUniquePosts";

// Encapsulates the feed data lifecycle: initial load, pagination, error state.
// Returning a clean { posts, loading, error, hasMore, loadMore } object lets
// the Feed component stay purely presentational.
export const usePosts = (limit = PAGE_SIZE) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPage = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const newPosts = await fetchPosts(pageNumber, limit);
      if (newPosts.length < limit) setHasMore(false);
      setPosts((prev) => mergeUniquePosts(prev, newPosts));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount.
  useEffect(() => {
    loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage);
  };

  return { posts, loading, error, hasMore, loadMore };
};
