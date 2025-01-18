import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {selectAllActiveDevices, setDevices} from "../../devices/store/slice.ts";
import {getConstraints, getUserMedia} from "../utils/getUserMedia.ts";
import {selectSelfWebCamVideoStream, setWebCamVideoStream} from "../store/slice.ts";
import {getDevices} from "../../devices/utils/getDevices.ts";
import {FaceDetectionCanvas} from "../../face-detection/components/FaceDetectionCanvas.tsx";
import {Button} from "antd";
import {IWithIndex} from "../../layout/model/constants.ts";
import {useVideoGridItemSize} from "../../layout/context/VideoGridContext.ts";
import { FaceMeshCanvas } from "../../face-detection/components/FaceMeshCanvas.tsx";

const SelfVideo = memo<IWithIndex>(({index}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {width, height} = useVideoGridItemSize(index);

  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectAllActiveDevices);
  const constraints = useMemo(() => getConstraints(devices, width, height), [devices, height, width]);

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
    <div style={{position: 'relative'}}>
      <Button
        onClick={toggleBackgroundBlur}
        type={"primary"}
        danger={isBackgroundBlurEnabled}
        variant={"solid"}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1
        }}
      >
        {isBackgroundBlurEnabled ? 'Отключить размытие фона' : 'Включить размытие фона'}
      </Button>

      <div style={{transform: 'scale(-1, 1)'}}>
        <video
          ref={videoRef}
          className="webcam-video"
          id="webcam-video-client"
          height={height}
          width={width}
          autoPlay
          playsInline
          style={{
            visibility: isBackgroundBlurEnabled ? 'hidden' : 'visible',
            position: 'absolute'
          }}
        />

        {isBackgroundBlurEnabled ? <FaceDetectionCanvas videoRef={videoRef} index={index}/> : null}

        <FaceMeshCanvas videoRef={videoRef} index={index} />
      </div>
    </div>
  )
})
SelfVideo.displayName = "SelfVideo";

export {
  SelfVideo
}