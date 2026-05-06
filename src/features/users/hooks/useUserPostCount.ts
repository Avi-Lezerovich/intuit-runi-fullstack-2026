import { useEffect, useState } from "react";
import { fetchUserPostCount } from "../../../api/users";

export const useUserPostCount = (
  userId: string | undefined,
  hasMore: boolean,
  loadedPostsCount: number
) => {
  const [totalEstimated, setTotalEstimated] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const loadCount = async () => {
      if (!userId) {
        return;
      }

      try {
        const count = await fetchUserPostCount(userId);
        if (active) {
          setTotalEstimated(count);
        }
      } catch {
        // Ignore count failures and fall back to the loaded amount.
      }
    };

    if (!hasMore) {
      setTotalEstimated(loadedPostsCount);
    } else {
      loadCount();
    }

    return () => {
      active = false;
    };
  }, [userId, loadedPostsCount, hasMore]);

  return totalEstimated;
};