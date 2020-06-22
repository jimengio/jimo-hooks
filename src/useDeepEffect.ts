import { useEffect, EffectCallback, DependencyList } from "react";
import useDeepCompareCache from "./useDeepCompareCache";

/**
 * useDeepEffect
 *
 * @param effect Imperative function that can return a cleanup function
 * @param deps If present, effect will only activate if the values in the list change.
 *
 */
export default function useDeepEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effect, useDeepCompareCache(deps));
}
