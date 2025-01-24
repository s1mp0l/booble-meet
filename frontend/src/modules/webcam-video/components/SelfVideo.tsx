import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {selectAllActiveDevices, setDevices} from "../../devices/store/slice.ts";
import {getConstraints, getUserMedia} from "../utils/getUserMedia.ts";
import {selectSelfWebCamVideoStream, setWebCamVideoStream} from "../store/slice.ts";
import {getDevices} from "../../devices/utils/getDevices.ts";
import {Button, Space} from "antd";
import {IWithIndex} from "../../layout/model/constants.ts";
import {useVideoGridItemSize} from "../../layout/context/VideoGridContext.ts";
import {FaceMeshCanvas} from "../../visual-effects/components/FaceMeshCanvas.tsx";
import {BodySegmentationCanvas} from "../../visual-effects/components/BodySegmentatioCanvas.tsx";
import {selectBackgroundEffect} from "../../visual-effects/store/visualEffectsSlice.ts";
import {selectConnectedUsers} from "../../conference/store/conferenceSlice.ts";

interface SelfVideoProps extends IWithIndex {
  createOffer: (targetUserId: string) => void;
}

const SelfVideo = memo<SelfVideoProps>(({index, createOffer}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {width, height} = useVideoGridItemSize(index);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectAllActiveDevices);
  const constraints = useMemo(() => getConstraints(devices, width, height), [devices, height, width]);
  const backgroundEffect = useAppSelector(selectBackgroundEffect);
  const videoStream = useAppSelector(selectSelfWebCamVideoStream);
  const connectedUsers = useAppSelector(selectConnectedUsers);

  const handleConnect = useCallback(() => {
    connectedUsers.forEach(user => {
      console.log("Creating offer for user", user.userId);
      createOffer(user.userId);
    });
  }, [connectedUsers, createOffer]);

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

  const showBackgroundEffect = backgroundEffect.type !== 'none';

  return (
    <div style={{position: 'relative', height: '100%'}}>
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

      <Space style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 2
      }}>
        <Button 
          onClick={handleConnect}
          type="primary"
        >
          Подключиться
        </Button>
      </Space>

      <div style={{ transform: 'scale(-1, 1)', height: '100%' }}>
        <video
          ref={videoRef}
          className="webcam-video"
          id="webcam-video-client"
          height={height}
          width={width}
          autoPlay
          playsInline
          style={{
            position: 'absolute',
            visibility: showBackgroundEffect ? 'hidden' : 'visible',
          }}
        />

        {showBackgroundEffect && <BodySegmentationCanvas index={index}/>}
        <FaceMeshCanvas videoRef={videoRef} index={index}/>
      </div>
    </div>
  );
});

SelfVideo.displayName = "SelfVideo";

export {
  SelfVideo
};