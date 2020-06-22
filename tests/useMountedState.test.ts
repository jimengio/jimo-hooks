import { renderHook } from "@testing-library/react-hooks";

import useMountedState from "../src/useMountedState";

describe("useMountedState", () => {
  it("should be defined", () => {
    expect(useMountedState).toBeDefined();
  });

  it("Mount", () => {
    const { result } = renderHook(() => useMountedState());

    expect(result.current()).toBeTruthy();
  });

  it("Unmount", () => {
    const { rerender, unmount, result } = renderHook(() => useMountedState());

    expect(result.current()).toBeTruthy();

    rerender();
    expect(result.current()).toBeTruthy();

    unmount();

    expect(result.current()).toBeFalsy();
  });
});
