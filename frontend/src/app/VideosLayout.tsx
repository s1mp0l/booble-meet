import { memo, useCallback, useState } from "react";
import { VideoGrid } from "../modules/layout/components/VideoGrid";
import { RecordedVideo } from "../modules/recorder/components/RecordedVideo";
import { ShareScreenVideo } from "../modules/share-screen/components/ShareScreenVideo";
import { selectIsActiveSelfSharedScreen } from "../modules/share-screen/store/slice";
import { useAppSelector } from "../store/hooks";
import { SelfVideo } from "../modules/webcam-video/components/SelfVideo";
import { selectHaveRecordedVideos } from "../modules/recorder/store/slice";
import { selectConnectedUsers, selectConferenceState } from "../modules/conference/store/conferenceSlice";
import { RemoteVideo } from "../modules/conference/components/RemoteVideo";
import { useWebRTC } from "../modules/conference/hooks/useWebRTC";
import { selectSelfWebCamVideoStream } from "../modules/webcam-video/store/slice";

const VideosLayout = memo(() => {
  const isActiveSelfSharedScreen = useAppSelector(selectIsActiveSelfSharedScreen);
  const haveRecordedVideos = useAppSelector(selectHaveRecordedVideos);
  const { username: currentUsername, roomId, token } = useAppSelector(selectConferenceState);
  const connectedUsers = useAppSelector(selectConnectedUsers);
  const videoStream = useAppSelector(selectSelfWebCamVideoStream);
  
  // Храним соответствие userId -> MediaStream
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});

  // Фильтруем текущего пользователя из списка
  const remoteUsers = connectedUsers.filter(user => user.username !== currentUsername);

  const handleRemoteStream = useCallback((stream: MediaStream, fromUserId: string) => {
    setRemoteStreams(prev => ({
      ...prev,
      [fromUserId]: stream
    }));
  }, []);

  console.log("Self video stream:", videoStream);

  const { createOffer } = useWebRTC({
    roomId: roomId || '',
    token,
    canvasStream: videoStream,
    onRemoteStream: handleRemoteStream
  });

  console.log("Remote streams:", remoteStreams);

  return (
    <VideoGrid>
      <SelfVideo index={0} createOffer={createOffer} />

      {isActiveSelfSharedScreen ? <ShareScreenVideo index={1}/> : null}

      {haveRecordedVideos ? <RecordedVideo index={2}/> : null}
      
      {remoteUsers.map((user, index) => (
        <RemoteVideo
          key={user.socketId}
          username={user.username}
          userId={user.userId}
          stream={remoteStreams[user.userId]}
          index={3 + index}
        />
      ))}
    </VideoGrid>
  );
});

VideosLayout.displayName = "VideosLayout";

export {
  VideosLayout
};