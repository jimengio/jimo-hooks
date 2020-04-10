import { useState, useCallback } from "react";

/**
 * useAsyncClick
 *
 * @param asyncFunc
 */
export default function useAsyncClick<R = any, Args extends any[] = any[]>(
  asyncFunc: (...args: Args) => Promise<R>
): [(...args: Args) => Promise<R> | Error, boolean] {
  const [loading, setLoading] = useState(false);

  const onAsyncEvent = useCallback(
    async (...args: Args) => {
      try {
        setLoading(true);
        return await asyncFunc(...args);
      } catch (error) {
        return error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, asyncFunc]
  );

  return [onAsyncEvent, loading];
}
