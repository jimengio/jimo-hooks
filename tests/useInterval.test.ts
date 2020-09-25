import { renderHook, act } from "@testing-library/react-hooks";

import useInterval from "../src/useInterval";

describe("useInterval", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should be defined", () => {
    expect(useInterval).toBeDefined();
  });

  it("Delay", () => {
    const fn = jest.fn();
    const { rerender, unmount } = renderHook(
      (props: number) => useInterval(fn, props),
      {
        initialProps: 200,
      }
    );

    rerender();
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);

    rerender(300);
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(3);

    unmount();
  });

  it("Returns", () => {
    let count = 0;
    const fn = jest.fn(() => count++);
    const { result, rerender } = renderHook(() => useInterval(fn, 200));

    rerender();
    expect(fn).toHaveBeenCalledTimes(0);

    rerender();
    rerender();
    rerender();
    expect(fn).toHaveBeenCalledTimes(0);
    expect(result.current.state).toEqual("running");

    jest.advanceTimersByTime(100);
    expect(count).toEqual(0);
    expect(fn).toHaveBeenCalledTimes(0);
    expect(result.current.state).toEqual("running");

    jest.advanceTimersByTime(100);
    expect(count).toEqual(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.state).toEqual("running");

    jest.advanceTimersByTime(200);
    expect(count).toEqual(2);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(result.current.state).toEqual("running");

    void act(() => {
      result.current.cancel();
    });
    expect(result.current.state).toEqual("idle");
    jest.runAllTimers();
    expect(count).toBe(2);

    void act(() => {
      result.current.run();
    });
    expect(result.current.state).toEqual("running");
    jest.advanceTimersByTime(200);
    expect(count).toEqual(3);
    expect(fn).toHaveBeenCalledTimes(3);

    void act(() => {
      result.current.cancel();
    });
    expect(result.current.state).toEqual("idle");
    jest.runAllTimers();
    expect(count).toBe(3);
  });

  it("Unmount", () => {
    const fn = jest.fn();
    const { result, rerender, unmount } = renderHook(() =>
      useInterval(fn, 200)
    );

    rerender();
    expect(fn).toHaveBeenCalledTimes(0);
    expect(result.current.state).toEqual("running");

    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.state).toEqual("running");

    unmount();

    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);

    void act(() => {
      result.current.cancel();
      result.current.run();
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
