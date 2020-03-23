import React, {
  CSSProperties,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

type EImgState = "loading" | "done" | "error" | "idle";

export default function useLoadImg(options: {
  src?: string;
  reqLoading?: boolean;
  className?: string;
  style?: CSSProperties;
  imgProps?: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >;
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
      imgProps?.onLoad && imgProps.onLoad(e);
    },
    [imgProps]
  );

  const handleImageErrored = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setState("error");
      imgProps?.onError && imgProps.onError(e);
    },
    [imgProps]
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
