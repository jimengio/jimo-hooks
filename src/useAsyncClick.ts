import { useState, useCallback } from "react";

/**
 * useAsyncClick
 *
 * @param asyncFunc
 */
export default function useAsyncClick<O>(
  asyncFunc: (o?: O) => Promise<void>
): [(o?: O) => void, boolean] {
  const [loading, setLoading] = useState(false);

  const onAsyncEvent = useCallback(
    async (options?: O) => {
      try {
        setLoading(true);
        await asyncFunc(options);
      } catch (error) {
        console.error("useAsyncFn loading error: %o", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, asyncFunc]
  );

  return [onAsyncEvent, loading];
}
