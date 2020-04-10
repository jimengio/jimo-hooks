import { useEffect, EffectCallback, DependencyList, useRef } from "react";

/**
 * useUpdateEffect
 *
 * @param effect Imperative function that can return a cleanup function
 * @param deps If present, effect will only activate if the values in the list change.
 *
 */
export default function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  const isFirstMount = useRef(true);

  return useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
    } else {
      effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
