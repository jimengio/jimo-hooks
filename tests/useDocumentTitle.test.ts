import { renderHook } from "@testing-library/react-hooks";

import useDocumentTitle from "../src/useDocumentTitle";

const Title1 = "title 1";
const Title2 = "title 2";

describe("useDocumentTitle", () => {
  it("Init", () => {
    const { rerender } = renderHook(
      ({ title }) => {
        useDocumentTitle(title);
      },
      {
        initialProps: { title: Title1 },
      }
    );

    rerender();
    expect(document.title).toEqual(Title1);
    rerender({ title: Title2 });
    expect(document.title).toEqual(Title2);
  });

  it("Unmount", () => {
    const { rerender: rerender1 } = renderHook(
      ({ title }) => {
        useDocumentTitle(title);
      },
      {
        initialProps: { title: Title1 },
      }
    );
    rerender1();
    expect(document.title).toEqual(Title1);

    const { rerender: rerender2, unmount } = renderHook(
      (props: { title: string; restore?: boolean }) => {
        useDocumentTitle(props.title, props.restore);
      },
      {
        initialProps: { title: Title2, restore: true },
      }
    );
    rerender2();
    expect(document.title).toEqual(Title2);
    unmount();
    expect(document.title).toEqual(Title1);
  });

  it("Formatter", () => {
    const { rerender } = renderHook(
      (props: { title: string | ((title: string) => string) }) => {
        useDocumentTitle(props.title);
      }
    );

    rerender({ title: Title1 });
    expect(document.title).toEqual(Title1);
    rerender({ title: (t: string) => `${t} ${Title2}` });
    expect(document.title).toEqual(`${Title1} ${Title2}`);
  });
});
