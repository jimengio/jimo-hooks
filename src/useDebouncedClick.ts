import useAsyncClick from "./useAsyncClick";
import useDebouncedCallback from "./useDebouncedCallback";

/**
 * useDebouncedClick
 *
 * @param asyncFunc
 * @param wait number @default 300
 * @param options maxWait, leading, trailing
 */
export default function useDebouncedClick<O>(
  asyncFunc: (o?: O) => Promise<void>,
  wait = 300,
  options?: { maxWait?: number; leading?: boolean; trailing?: boolean }
): [(o?: O) => void, boolean, () => void, () => void] {
  const [asyncClick, loading] = useAsyncClick<O>(asyncFunc);

  const [
    onClickEvent,
    cancelDebouncedCallback,
    callPending,
  ] = useDebouncedCallback(
    (args?: O) => {
      asyncClick(args);
    },
    wait,
    options
  );

  return [onClickEvent, loading, cancelDebouncedCallback, callPending];
}
