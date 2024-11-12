import {memo, useEffect, useMemo, useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {getDevices} from "../../devices/utils/getDevices.ts";
import {selectAllActiveDevices, setDevices} from "../../devices/store/slice.ts";
import {getConstraints, getUserMedia} from "../utils/getUserMedia.ts";

const SelfVideo = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectAllActiveDevices);
  const constraints = useMemo(() => getConstraints(devices), [devices]);

  useEffect(() => {
    (async () => {
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = await getUserMedia();
      }
    })();
  }, [constraints]);

  useEffect(() => {
    (async () => {
      const mediaDevices = await getDevices();

      dispatch(setDevices(mediaDevices))
    })();
  }, [dispatch]);

  return (
    <video
      ref={videoRef}
      id="webcam-video-client"
      height={360}
      width={640}
      autoPlay
      playsInline
    />
  )
})
SelfVideo.displayName = "SelfVideo";

export {
  SelfVideo
}