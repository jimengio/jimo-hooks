import { renderHook } from "@testing-library/react-hooks";

import useDeepCompareCache from "../src/useDeepCompareCache";

describe("useDeepCompareCache", () => {
  const obj1 = { a: 1, b: { b1: 2 } };
  const obj2 = { a: 1, b: { b1: 2 } };

  it("Origin value", () => {
    const { result } = renderHook(() => useDeepCompareCache(obj1));

    expect(result.current).toEqual(obj1);
  });

  it("Compare data", () => {
    const { result } = renderHook(() => useDeepCompareCache(obj1));

    // the same data
    expect(result.current).toEqual(obj2);

    obj1.b.b1 = 0;
    expect(result.current).toEqual(obj1);

    obj2.b.b1 = -1;
    expect(result.current).not.toEqual(obj2);
  });
});
