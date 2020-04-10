import { useEffect, useRef } from "react";

/**
 * useUnmount
 *
 * @param fn
 */
const useUnmount = (fn: () => any): void => {
  const fnRef = useRef(fn);

  fnRef.current = fn;

  useEffect(() => () => fnRef.current(), []);
};

export default useUnmount;
