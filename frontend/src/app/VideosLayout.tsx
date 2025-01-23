import { memo } from "react";
import { VideoGrid } from "../modules/layout/components/VideoGrid";
import { RecordedVideo } from "../modules/recorder/components/RecordedVideo";
import { ShareScreenVideo } from "../modules/share-screen/components/ShareScreenVideo";
import { selectIsActiveSelfSharedScreen } from "../modules/share-screen/store/slice";
import { useAppSelector } from "../store/hooks";
import { SelfVideo } from "../modules/webcam-video/components/SelfVideo";
import { selectHaveRecordedVideos } from "../modules/recorder/store/slice";

const VideosLayout = memo(() => {
    const isActiveSelfSharedScreen = useAppSelector(selectIsActiveSelfSharedScreen);
    const haveRecordedVideos = useAppSelector(selectHaveRecordedVideos);
  
    return (
      <VideoGrid>
        <SelfVideo index={0} />

        {isActiveSelfSharedScreen ? <ShareScreenVideo index={1}/> : null}

        {haveRecordedVideos ? <RecordedVideo index={2}/> : null}
      </VideoGrid>
    )
  })
  VideosLayout.displayName = "VideosLayout";
  
  export {
    VideosLayout
  }