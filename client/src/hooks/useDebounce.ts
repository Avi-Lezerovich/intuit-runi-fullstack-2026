import { useState, useEffect } from "react";

/**
 * Generic debounce hook — returns `value` only after it has stayed unchanged for `delay` ms.
 * Used to throttle search queries (Users page) so we don't fire an API request on every keystroke.
 * Each new `value` resets the timer; on unmount or rapid changes the pending timer is cleared.
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
