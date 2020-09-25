import React, { Component } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import ReactTestUtils from "react-dom/test-utils";

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

    const node: React.ReactElement<React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >> = result.current.imgNode;

    class ImgNode extends Component {
      render() {
        return <div>{node}</div>;
      }
    }

    const rendered = ReactTestUtils.renderIntoDocument<Component>(
      <ImgNode />
    ) as Component;
    const img = ReactTestUtils.findRenderedDOMComponentWithTag(rendered, "img");
    void act(() => {
      ReactTestUtils.Simulate.error(img);
    });

    expect(onError).toHaveBeenCalled();
    expect(result.current.imgNode).not.toBeNull();
    expect(result.current.state).toEqual("error");
    expect(result.current.loading).toEqual(false);
    expect(result.current.isError).toEqual(true);

    void act(() => {
      ReactTestUtils.Simulate.load(img);
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

    const node: React.ReactElement<React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >> = result.current.imgNode;

    expect(node.type).toEqual("img");
    expect(node.props.src).toEqual(optionsObj.src);
    expect(node.props.style).toEqual(optionsObj.style);
    expect(node.props.className).toEqual(optionsObj.className);
    expect(result.current.imgNode.key).toEqual(optionsObj.imgProps.key);
  });
});
