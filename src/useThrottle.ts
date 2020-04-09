import { useState } from "react";
import useUpdateEffect from "./useUpdateEffect";
import useThrottleFn from "./useThrottleFn";

/**
 * useThrottle
 *
 * @param value
 * @param wait number @default 300
 */
export default function useThrottle<T>(value: T, wait = 300): T {
  const [state, setState] = useState<T>(value);

  const { callback } = useThrottleFn((v: T) => {
    setState(v);
  }, wait);

  useUpdateEffect(() => {
    callback(value);
  }, [value]);

  return state;
}
