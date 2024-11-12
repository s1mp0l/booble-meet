import {memo, useEffect, useRef} from "react";
import {selectSelfSharedScreenStream} from "../store/slice.ts";
import {useAppSelector} from "../../../store/hooks.ts";

const ShareScreenVideo = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStream = useAppSelector(selectSelfSharedScreenStream);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.srcObject = mediaStream;
    }
  }, [mediaStream]);

  console.log(mediaStream);

  if (!mediaStream) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      id="sharescreen-video-client"
      height={360}
      width={640}
      autoPlay
      playsInline
    />
  )
})
ShareScreenVideo.displayName = "ShareScreenVideo";

export {
  ShareScreenVideo
}