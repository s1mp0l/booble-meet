import { memo } from "react";
import { VideoGrid } from "../modules/layout/components/VideoGrid";
import { RecordedVideo } from "../modules/recorder/components/RecordedVideo";
import { ShareScreenVideo } from "../modules/share-screen/components/ShareScreenVideo";
import { selectIsActiveSelfSharedScreen } from "../modules/share-screen/store/slice";
import { useAppSelector } from "../store/hooks";
import { SelfVideo } from "../modules/webcam-video/components/SelfVideo";
import { selectHaveRecordedVideos } from "../modules/recorder/store/slice";
import { selectConnectedUsers, selectConferenceState } from "../modules/conference/store/conferenceSlice";
import { RemoteVideo } from "../modules/conference/components/RemoteVideo";
import { useWebSocket } from "../modules/conference/hooks/useWebSocket";

const VideosLayout = memo(() => {
  const isActiveSelfSharedScreen = useAppSelector(selectIsActiveSelfSharedScreen);
  const haveRecordedVideos = useAppSelector(selectHaveRecordedVideos);
  const { username: currentUsername, token } = useAppSelector(selectConferenceState);
  const connectedUsers = useAppSelector(selectConnectedUsers);
  
  // Получаем методы WebSocket
  const { sendOffer, sendAnswer, sendIceCandidate, registerHandlers } = useWebSocket(token);
  
  // Фильтруем текущего пользователя из списка
  const remoteUsers = connectedUsers.filter(user => user.username !== currentUsername);

  return (
    <VideoGrid>
      <SelfVideo />

      {remoteUsers.map((user) => (
        <RemoteVideo
          key={user.socketId}
          username={user.username}
          userId={user.userId}
          sendOffer={sendOffer}
          sendAnswer={sendAnswer}
          sendIceCandidate={sendIceCandidate}
          registerHandlers={registerHandlers}
        />
      ))}

      {isActiveSelfSharedScreen && (
        <ShareScreenVideo />
      )}

      {haveRecordedVideos && (
        <RecordedVideo />
      )}
    </VideoGrid>
  );
});

VideosLayout.displayName = "VideosLayout";

export {
  VideosLayout
};