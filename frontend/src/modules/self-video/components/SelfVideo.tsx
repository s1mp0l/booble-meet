import {memo, useEffect, useMemo, useRef} from "react";
import {Flex, Space} from "antd";
import {SelectVideoDevice} from "../../devices/components/SelectDevice/SelectVideoDevice.tsx";
import {SelectAudioInputDevice} from "../../devices/components/SelectDevice/SelectInputAudioDevice.tsx";
import {SelectAudioOutputDevice} from "../../devices/components/SelectDevice/SelectOutputAudioDevice.tsx";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {getDevices} from "../../devices/utils/getDevices.ts";
import {selectAllActiveDevices, setDevices} from "../../devices/store/slice.ts";

interface IActiveDevicesSelected {
  video: MediaDeviceInfo | null;
  audioInput: MediaDeviceInfo | null;
  audioOutput: MediaDeviceInfo | null;
}

const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  audio: true,
  video: true,
}

const getConstraints = (devices: IActiveDevicesSelected): MediaStreamConstraints => ({
  ...DEFAULT_CONSTRAINTS,
  audio: devices.audioInput
    ? {
      deviceId: {exact: devices.audioInput.deviceId}
    }
    : true,
  video: devices.video
    ? {
      width: 1280,
      height: 720,
      deviceId: {exact: devices.video.deviceId}
    }
    : true,
})

const SelfVideo = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useAppDispatch();
  const devices: IActiveDevicesSelected = useAppSelector(selectAllActiveDevices);
  const constraints = useMemo(() => getConstraints(devices), [devices]);

  useEffect(() => {
    (async () => {
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = await navigator.mediaDevices.getUserMedia(constraints);
      }
    })();
  }, [constraints]);

  useEffect(() => {
    (async () => {
      const mediaDevices = await getDevices();

      dispatch(setDevices(mediaDevices))
    })();
  }, [dispatch]);

  console.log(videoRef.current?.srcObject)

  return (
    <Flex vertical gap={16} align={"center"}>
      <video
        ref={videoRef}
        id="video-client"
        height={560}
        width={720}
        autoPlay
        playsInline
      />

      <Space>
        <SelectVideoDevice/>
        <SelectAudioInputDevice/>
        <SelectAudioOutputDevice/>
      </Space>
    </Flex>
  )
})
SelfVideo.displayName = "SelfVideo";

export {
  SelfVideo
}