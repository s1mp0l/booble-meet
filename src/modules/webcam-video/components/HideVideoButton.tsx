import {memo, useCallback, useEffect} from "react";
import {Button, Tooltip} from "antd";
import {VideoCameraOutlined, StopOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {selectIsVideoHidden, selectSelfWebCamVideoStream, toggleVideo} from "../store/slice.ts";
import {selectEffectsStream} from "../../visual-effects/store/visualEffectsSlice.ts";

const HideVideoButton = memo(() => {
  const dispatch = useAppDispatch();
  const isVideoHidden = useAppSelector(selectIsVideoHidden);
  const stream = useAppSelector(selectSelfWebCamVideoStream);
  const effectsStream = useAppSelector(selectEffectsStream);

  const handleToggleVideo = useCallback(() => {
    dispatch(toggleVideo());
  }, [dispatch]);

  useEffect(() => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoHidden;
      });
    }
    
    if (effectsStream) {
      effectsStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoHidden;
      });
    }
  }, [stream, effectsStream, isVideoHidden]);

  return (
    <Tooltip title={isVideoHidden ? "Камера выключена" : "Камера включена"}>
      <Button
        type="default"
        icon={isVideoHidden ? <StopOutlined /> : <VideoCameraOutlined />}
        onClick={handleToggleVideo}
        danger={isVideoHidden}
      />
    </Tooltip>
  );
});

HideVideoButton.displayName = "HideVideoButton";

export {
  HideVideoButton
}; 