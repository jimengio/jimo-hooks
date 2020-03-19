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
  imgPorps?: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >;
}): {
  imgNode: JSX.Element;
  state: EImgState;
  loading: boolean;
  isError: boolean;
} {
  const { src, reqLoading, className, style, imgPorps } = options;
  const [state, setState] = useState<EImgState>("idle");

  const loading = (state === "loading" && src != null) || !!reqLoading;
  const isError = state === "error" || (src == null && !reqLoading);

  const handleImageLoaded = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setState("done");
      imgPorps?.onLoad && imgPorps.onLoad(e);
    },
    [imgPorps]
  );

  const handleImageErrored = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setState("error");
      imgPorps?.onError && imgPorps.onError(e);
    },
    [imgPorps]
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
        {...imgPorps}
        src={src}
        onLoad={handleImageLoaded}
        onError={handleImageErrored}
      />
    ),
    [className, style, src, handleImageLoaded, handleImageErrored, imgPorps]
  );

  return { imgNode, state, loading, isError };
}
