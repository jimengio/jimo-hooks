import useAsyncClick from "./useAsyncClick";
import useDebouncedCallback from "./useDebouncedCallback";

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
): [(...args: Args) => void, boolean, () => void, () => void] {
  const [asyncClick, loading] = useAsyncClick<R, Args>(asyncFunc);

  const [
    onClickEvent,
    cancelDebouncedCallback,
    callPending,
  ] = useDebouncedCallback<Args>(
    async (...args: Args) => {
      await asyncClick(...args);
    },
    wait,
    options
  );

  return [onClickEvent, loading, cancelDebouncedCallback, callPending];
}
