import { renderHook } from "@testing-library/react-hooks";

import useUnmount from "../src/useUnmount";

describe("useUnmount", () => {
  it("should be defined", () => {
    expect(useUnmount).toBeDefined();
  });

  it("Mount", () => {
    const fn = jest.fn();
    const { rerender } = renderHook(() => useUnmount(fn));

    expect(fn).not.toHaveBeenCalled();

    rerender();

    expect(fn).not.toHaveBeenCalled();

    rerender();
    rerender();
    rerender();

    expect(fn).not.toHaveBeenCalled();
  });

  it("Unmount", () => {
    const fn = jest.fn();
    const { rerender, unmount } = renderHook(() => useUnmount(fn));

    expect(fn).not.toHaveBeenCalled();

    rerender();

    expect(fn).not.toHaveBeenCalled();

    unmount();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("fn props change", () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const { rerender, unmount } = renderHook(
      (fn: () => void) => useUnmount(fn),
      {
        initialProps: fn1,
      }
    );

    expect(fn1).not.toHaveBeenCalled();

    rerender(fn2);

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();

    unmount();
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
  });
});
