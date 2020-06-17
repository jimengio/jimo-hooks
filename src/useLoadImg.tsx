import React, {
  CSSProperties,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import useDeepCompareCache from "./useDeepCompareCache";

export type EImgState = "loading" | "done" | "error" | "idle";

type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export default function useLoadImg(options: {
  src?: string;
  reqLoading?: boolean;
  className?: string;
  style?: CSSProperties;
  imgProps?: ImageProps;
}): {
  imgNode: JSX.Element;
  state: EImgState;
  loading: boolean;
  isError: boolean;
} {
  const { src, reqLoading, className, style, imgProps } = options;
  const [state, setState] = useState<EImgState>("idle");

  const loading = (state === "loading" && src != null) || !!reqLoading;
  const isError = state === "error" || (src == null && !reqLoading);

  const handleImageLoaded = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setState("done");
      imgProps?.onLoad?.(e);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useDeepCompareCache([imgProps])
  );

  const handleImageErrored = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setState("error");
      imgProps?.onError?.(e);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useDeepCompareCache([imgProps])
  );

  useEffect(() => {
    if (src) {
      setState("loading");
    } else {
      setState("idle");
    }
  }, [src]);

  const imgNode = useMemo(
    () => (
      <img
        className={className}
        style={style}
        {...imgProps}
        src={src}
        onLoad={handleImageLoaded}
        onError={handleImageErrored}
      />
    ),
    [className, style, src, handleImageLoaded, handleImageErrored, imgProps]
  );

  return { imgNode, state, loading, isError };
}
