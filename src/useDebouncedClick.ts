import useAsyncClick from "./useAsyncClick";
import useDebouncedCallback from "./useDebouncedCallback";

export type ReturnReslut<Args extends any[] = any[]> = {
  callback: (...args: Args) => void;
  loading: boolean;
  cancelDebouncedCallback: () => void;
  callPending: () => void;
  error: Error | undefined;
};

/**
 * useDebouncedClick
 *
 * @param asyncFunc
 * @param wait number @default 300
 * @param options maxWait, leading, trailing
 */
export default function useDebouncedClick<R = any, Args extends any[] = any[]>(
  asyncFunc: (...args: Args) => Promise<R>,
  wait = 300,
  options?: { maxWait?: number; leading?: boolean; trailing?: boolean }
): ReturnReslut<Args> {
  const { callback, loading, error } = useAsyncClick<R, Args>(asyncFunc);

  const [
    onClickEvent,
    cancelDebouncedCallback,
    callPending,
  ] = useDebouncedCallback<Args>(
    async (...args: Args) => {
      await callback(...args);
    },
    wait,
    options
  );

  return {
    callback: onClickEvent,
    loading,
    cancelDebouncedCallback,
    callPending,
    error,
  };
}
