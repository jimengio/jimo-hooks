import { renderHook } from "@testing-library/react-hooks";

import useUpdateEffect from "../src/useUpdateEffect";

describe("useUpdateEffect", () => {
  it("should be defined", () => {
    expect(useUpdateEffect).toBeDefined();
  });

  it("First", () => {
    const effect = jest.fn();
    const { rerender } = renderHook(() => useUpdateEffect(effect));
    expect(effect).not.toHaveBeenCalled();

    rerender();
    expect(effect).toHaveBeenCalledTimes(1);
  });

  it("Deps", () => {
    let tot = 0;
    const { rerender } = renderHook(() => {
      useUpdateEffect(() => {
        tot = 2;
      }, [tot]);
    });
    expect(tot).toEqual(0);
    tot = 1;
    rerender();
    expect(tot).toEqual(2);
  });
});
