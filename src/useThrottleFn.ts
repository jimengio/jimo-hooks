import { useCallback, useRef } from "react";
import useUnmount from "./useUnmount";

/**
 * useThrottleFn
 *
 * @param fn function
 * @param wait number @default 300
 */
export default function useThrottleFn<T extends any[]>(
  fn: (...args: T) => any,
  wait = 300
): { callback: (...args: T) => void; cancel: () => void } {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const currentArgs = useRef<any>();

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = undefined;
  }, []);

  const callback = useCallback(
    (...args: T) => {
      currentArgs.current = args;
      if (!timer.current) {
        timer.current = setTimeout(() => {
          fnRef.current(...currentArgs.current);
          timer.current = undefined;
        }, wait);
      }
    },
    [wait]
  );

  useUnmount(() => cancel);

  return {
    callback,
    cancel,
  };
}