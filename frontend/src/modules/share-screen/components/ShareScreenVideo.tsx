import {memo, useEffect, useRef} from "react";
import {selectSelfSharedScreenStream} from "../store/slice.ts";
import {useAppSelector} from "../../../store/hooks.ts";
import {useVideoGridItemSize} from "../../layout/context/VideoGridContext.ts";

const ShareScreenVideo = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStream = useAppSelector(selectSelfSharedScreenStream);
  const {width, height} = useVideoGridItemSize();
  
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.srcObject = mediaStream;
    }
  }, [mediaStream]);

  if (!mediaStream) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      id="sharescreen-video-client"
      height={height}
      width={width}
      autoPlay
      playsInline
    />
  )
})
ShareScreenVideo.displayName = "ShareScreenVideo";

export {
  ShareScreenVideo
}