import { useCallback, useEffect, useRef, useState } from "react";
import useMountedState from "./useMountedState";

export type ETimerState = "idle" | "running";

/**
 * useInterval
 *
 * @param fn
 * @param delay
 */
export default function useInterval(
  fn: () => void,
  delay?: number
): { state: ETimerState; cancel: () => void; run: () => void } {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const fnRef = useRef<() => void>();

  fnRef.current = fn;

  const getMounted = useMountedState();
  const [state, setState] = useState<ETimerState>("idle");

  const run = useCallback(() => {
    getMounted() && setState("running");

    timer.current = setInterval(() => {
      fnRef.current?.();
    }, delay || 0);
  }, [delay, getMounted]);

  const cancel = useCallback(() => {
    getMounted() && setState("idle");

    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = undefined;
  }, [getMounted]);

  useEffect(() => {
    if (timer.current) {
      cancel();
    }

    run();

    return cancel;
  }, [delay, cancel, run]);

  return { state, cancel, run };
}
