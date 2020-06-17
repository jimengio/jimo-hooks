import { renderHook, act } from "@testing-library/react-hooks";

import useLoadImg from "../src/useLoadImg";

describe("useLoadImg", () => {
  it("Init null", () => {
    const { result } = renderHook(() => useLoadImg({}));

    expect(result.current.imgNode).not.toBeNull();
    expect(result.current.state).toEqual("idle");
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(true);
  });

  it("Init", () => {
    const onError = jest.fn();
    const onLoad = jest.fn();
    const { result } = renderHook(() =>
      useLoadImg({ src: "./demo.jpg", imgProps: { onError, onLoad } })
    );

    expect(result.current.imgNode).not.toBeNull();
    expect(result.current.state).toEqual("loading");
    expect(result.current.loading).toEqual(true);
    expect(result.current.isError).toEqual(false);

    const node = result.current.imgNode;

    // [TODO] Manual
    act(() => {
      node.props.onError();
    });
    expect(onError).toHaveBeenCalled();
    expect(result.current.imgNode).not.toBeNull();
    expect(result.current.state).toEqual("error");
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(true);

    // [TODO] Manual
    act(() => {
      node.props.onLoad();
    });
    expect(onLoad).toHaveBeenCalled();
    expect(result.current.imgNode).not.toBeNull();
    expect(result.current.state).toEqual("done");
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(false);
  });

  it("Image props", () => {
    const optionsObj = {
      src: "./demo.jpg",
      style: { width: "100%" },
      className: "classname-demo",
      imgProps: { key: "img-key" },
    };
    const { result } = renderHook(() => useLoadImg(optionsObj));

    expect(result.current.imgNode.type).toEqual("img");
    expect(result.current.imgNode.props.src).toEqual(optionsObj.src);
    expect(result.current.imgNode.props.style).toEqual(optionsObj.style);
    expect(result.current.imgNode.props.className).toEqual(
      optionsObj.className
    );
    expect(result.current.imgNode.key).toEqual(optionsObj.imgProps.key);
  });
});
