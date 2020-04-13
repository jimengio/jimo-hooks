import {
  renderHook,
  act,
  RenderHookResult,
} from "@testing-library/react-hooks";

import useDebouncedClick, { ReturnResult } from "../src/useDebouncedClick";

const asyncFn = (count: number): Promise<number> => {
  return new Promise((res, rej) => {
    setTimeout(
      value => {
        res(value);
      },
      0,
      count
    );
  });
};

const errFn = (): Promise<number> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      rej(0);
    }, 0);
  });
};

describe("useDebouncedClick", () => {
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
    expect(useDebouncedClick).toBeDefined();
  });

  it("Loading state", async () => {
    let hook: RenderHookResult<unknown, ReturnResult<[number]>>;

    act(() => {
      hook = renderHook(() => useDebouncedClick(asyncFn, 200));
    });

    await act(async () => {
      expect(hook.result.current.loading).toEqual(false);

      hook.result.current.callback(1);

      jest.advanceTimersByTime(200);
      expect(hook.result.current.loading).toEqual(true);
      await hook.waitForNextUpdate();
      expect(hook.result.current.loading).toEqual(false);
      expect(hook.result.current.error).toBeUndefined();
    });
  });

  it("Debounce", async () => {
    let count = 0;
    const fn = jest.fn(props => {
      count = props;
    });
    let hook: RenderHookResult<unknown, ReturnResult<[number]>>;

    act(() => {
      hook = renderHook(() => useDebouncedClick<void>(fn as any, 200));
    });

    await act(async () => {
      expect(fn).toHaveBeenCalledTimes(0);

      hook.result.current.callback(1);
      hook.result.current.callback(2);
      hook.result.current.callback(3);

      jest.advanceTimersByTime(200);
      expect(fn).toHaveBeenCalledTimes(1);
      await hook.waitForNextUpdate();
      expect(count).toEqual(3);
    });
  });
});
