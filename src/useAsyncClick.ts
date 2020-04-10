import { useState, useCallback } from "react";

export type AsyncState = {
  loading: boolean;
  error?: Error | undefined;
};

/**
 * useAsyncClick
 *
 * @param asyncFunc
 */
export default function useAsyncClick<R = any, Args extends any[] = any[]>(
  asyncFunc: (...args: Args) => Promise<R>,
  initState?: AsyncState
): {
  callback: (...args: Args) => Promise<R>;
  loading: boolean;
  error: Error | undefined;
} {
  const [state, setState] = useState<AsyncState>(
    initState || { loading: false }
  );

  const onAsyncEvent = useCallback(
    async (...args: Args) => {
      try {
        setState({ loading: true });
        const result = await asyncFunc(...args);

        setState({ loading: false, error: undefined });
        return result;
      } catch (error) {
        setState({ loading: false, error });
        return error;
      }
    },
    [asyncFunc]
  );

  return {
    callback: onAsyncEvent,
    loading: state.loading,
    error: state.error,
  };
}
