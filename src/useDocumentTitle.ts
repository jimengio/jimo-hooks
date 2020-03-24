import { useEffect, useRef } from "react";

/**
 * useDocumentTitle
 *
 * @param title
 * @param restore Restore on unmount
 */
export default function useDocumentTitle(
  title: string | ((title: string) => string),
  restore?: boolean
) {
  const prevTitleRef = useRef<string>(document.title);

  useEffect(() => {
    document.title =
      typeof title === "function" ? title(document.title) : title;
  }, [title]);

  useEffect(() => {
    if (restore) {
      const prevTitle = prevTitleRef.current;
      return () => {
        document.title = prevTitle;
      };
    } else {
      return;
    }
  }, [restore]);
}
