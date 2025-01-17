import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {selectAllActiveDevices, setDevices} from "../../devices/store/slice.ts";
import {getConstraints, getUserMedia} from "../utils/getUserMedia.ts";
import {selectSelfWebCamVideoStream, setWebCamVideoStream} from "../store/slice.ts";
import {getDevices} from "../../devices/utils/getDevices.ts";
import {FaceDetectionCanvas} from "../../face-detection/components/FaceDetectionCanvas.tsx";
import {Button} from "antd";

const SelfVideo = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectAllActiveDevices);
  const constraints = useMemo(() => getConstraints(devices), [devices]);
  const [isBackgroundBlurEnabled, setIsBackgroundBlurEnabled] = useState(false);

  const videoStream = useAppSelector(selectSelfWebCamVideoStream);

  // SET WEBCAM MEDIA STREAM
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.srcObject = videoStream;
    }
  }, [videoStream]);

  const startWebCamVideo = useCallback(() => {
      (async () => {
        const mediaStream = await getUserMedia(constraints);

        if (mediaStream) {
          dispatch(setWebCamVideoStream(mediaStream));
        }
      })()
    },
    [dispatch, constraints]
  );

  const stopWebCamVideo = useCallback(() => {
      dispatch(setWebCamVideoStream(null));
    },
    [dispatch]
  );

  // GET WEBCAM MEDIA STREAM
  useEffect(() => {
    startWebCamVideo();

    return () => stopWebCamVideo();
  }, [startWebCamVideo, stopWebCamVideo]);

  // GET MEDIA DEVICES
  useEffect(() => {
    (async () => {
      const mediaDevices = await getDevices();

      dispatch(setDevices(mediaDevices))
    })();
  }, [dispatch]);

  const toggleBackgroundBlur = useCallback(() => {
    setIsBackgroundBlurEnabled(prev => !prev);
  }, []);

  return (
    <div>
      <Button
        onClick={toggleBackgroundBlur}
        type={"primary"}
        danger={isBackgroundBlurEnabled}
        variant={"solid"}
        style={{marginBottom: '10px'}}
      >
        {isBackgroundBlurEnabled ? 'Отключить размытие фона' : 'Включить размытие фона'}
      </Button>

      <div style={{position: 'relative'}}>
        <video
          ref={videoRef}
          className="webcam-video"
          id="webcam-video-client"
          height={360}
          width={640}
          autoPlay
          playsInline
          style={{
            visibility: isBackgroundBlurEnabled ? 'hidden' : 'visible',
            position: isBackgroundBlurEnabled ? 'absolute' : 'relative'
          }}
        />

        {isBackgroundBlurEnabled ? <FaceDetectionCanvas videoRef={videoRef}/> : null}
      </div>
    </div>
  )
})
SelfVideo.displayName = "SelfVideo";

export {
  SelfVideo
}