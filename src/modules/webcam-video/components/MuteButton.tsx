import {memo, useCallback, useEffect} from "react";
import {Button, Tooltip} from "antd";
import {AudioMutedOutlined, AudioOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {selectIsMuted, selectSelfWebCamVideoStream, toggleMute} from "../store/slice.ts";

const MuteButton = memo(() => {
  const dispatch = useAppDispatch();
  const isMuted = useAppSelector(selectIsMuted);
  const stream = useAppSelector(selectSelfWebCamVideoStream);

  const handleToggleMute = useCallback(() => {
    dispatch(toggleMute());
  }, [dispatch]);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [stream, isMuted]);

  return (
    <Tooltip title={isMuted ? "Микрофон выключен" : "Микрофон включен"}>
      <Button
        type="default"
        icon={isMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
        onClick={handleToggleMute}
        danger={isMuted}
      />
    </Tooltip>
  );
});

MuteButton.displayName = "MuteButton";

export {
  MuteButton
}; 