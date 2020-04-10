import { renderHook, act } from "@testing-library/react-hooks";

import useAsyncClick from "../src/useAsyncClick";

const asyncFn = (count: number): Promise<number> => {
  return new Promise((res, rej) => {
    setTimeout(
      value => {
        res(value);
      },
      200,
      count
    );
  });
};

const errFn = (): Promise<number> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      rej(0);
    }, 200);
  });
};

describe("useAsyncClick", () => {
  it("should be defined", () => {
    expect(useAsyncClick).toBeDefined();
  });

  it("Loading state", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncClick(asyncFn)
    );

    expect(result.current.loading).toEqual(false);

    act(() => {
      result.current.callback(1);
    });

    expect(result.current.loading).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.loading).toEqual(false);
    expect(result.current.error).toBeUndefined();
  });

  it("Funtion result", async () => {
    let res1;
    let res2;
    const { result, rerender } = renderHook(
      props => useAsyncClick<number>(props),
      {
        initialProps: asyncFn,
      }
    );

    expect(result.current.loading).toEqual(false);

    await act(async () => {
      res1 = await result.current.callback(1);
    });

    expect(res1).toEqual(1);
    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toEqual(false);

    rerender(errFn);
    expect(result.current.loading).toEqual(false);

    await act(async () => {
      res2 = await result.current.callback();
    });

    expect(res2).toEqual(0);
    expect(result.current.error).toEqual(0);
    expect(result.current.loading).toEqual(false);
  });
});
