import { useState, useCallback } from "react";
import useMountedState from "./useMountedState";

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
  const getMounted = useMountedState();

  const onAsyncEvent = useCallback(
    async (...args: Args) => {
      try {
        setState({ loading: true });
        const result = await asyncFunc(...args);

        getMounted() && setState({ loading: false, error: undefined });
        return result;
      } catch (error) {
        getMounted() && setState({ loading: false, error: error as Error });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return error;
      }
    },
    [asyncFunc, getMounted]
  );

  return {
    callback: onAsyncEvent,
    loading: state.loading,
    error: state.error,
  };
}
