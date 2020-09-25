import { useRef } from "react";
import { renderHook } from "@testing-library/react-hooks";

import useDeepEffect from "../src/useDeepEffect";

describe("useDeepEffect", () => {
  const obj1 = { a: 1, b: { b1: 2 } };
  const obj2 = { a: 1, b: { b1: 2 } };
  const obj3 = { a: 1, b: { b1: 0 } };

  it("Same values", (done) => {
    const { rerender } = renderHook(
      ({ obj }) => {
        const firstRenderRef = useRef(true);

        useDeepEffect(() => {
          if (firstRenderRef.current) {
            firstRenderRef.current = false;
          } else {
            done.fail("Trigger the same value");
          }
        }, [obj]);
      },
      {
        initialProps: { obj: obj1 },
      }
    );

    // init
    rerender();

    rerender({ obj: obj1 });
    rerender({ obj: obj2 });
    done();
  });

  it("Different values", () => {
    const { rerender } = renderHook(
      ({ obj }) => {
        const firstRenderRef = useRef(true);

        useDeepEffect(() => {
          if (firstRenderRef.current) {
            firstRenderRef.current = false;
            expect(obj).toEqual(obj1);
          } else {
            expect(obj).toEqual(obj3);
          }
        }, [obj]);
      },
      {
        initialProps: { obj: obj1 },
      }
    );

    // init
    rerender();

    rerender({ obj: obj3 });
  });
});
