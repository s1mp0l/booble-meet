import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {selectAllActiveDevices, setDevices} from "../../devices/store/slice.ts";
import {getConstraints, getUserMedia} from "../utils/getUserMedia.ts";
import {selectSelfWebCamVideoStream, setWebCamVideoStream} from "../store/slice.ts";
import {getDevices} from "../../devices/utils/getDevices.ts";
import {Button} from "antd";
import {useVideoGridItemSize} from "../../layout/context/VideoGridContext.ts";
import {VisualEffectsCanvas} from "../../visual-effects/components/VisualEffectsCanvas";

const SelfVideo = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {width, height} = useVideoGridItemSize(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectAllActiveDevices);
  const constraints = useMemo(() => getConstraints(devices), [devices]);
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
        try {
          const mediaStream = await getUserMedia(constraints);

          if (mediaStream) {
            dispatch(setWebCamVideoStream(mediaStream));
            setCameraError(null);
          } else {
            setCameraError('Не удалось получить доступ к камере');
          }
        } catch {
          setCameraError('Ошибка при запросе доступа к камере');
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

  return (
    <div style={{position: 'relative', width, height }}>
      {cameraError && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          zIndex: 2,
          textAlign: 'center'
        }}>
          {cameraError}
          <Button 
            onClick={startWebCamVideo}
            type="primary"
            style={{marginTop: '10px', display: 'block', width: '100%'}}
          >
            Повторить попытку
          </Button>
        </div>
      )}

      <video
        ref={videoRef}
        style={{ visibility: 'hidden', objectFit: 'cover', transform: 'scale(-1, 1)' }}
        autoPlay
        muted
        width={width}
        height={height}
        playsInline
      />

      <VisualEffectsCanvas 
        videoRef={videoRef} 
        width={width} 
        height={height}
      />
    </div>
  );
});

SelfVideo.displayName = "SelfVideo";

export {
  SelfVideo
};