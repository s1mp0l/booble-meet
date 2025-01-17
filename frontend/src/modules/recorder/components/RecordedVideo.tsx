import {memo, useRef} from "react";
import {useAppSelector} from "../../../store/hooks.ts";
import {selectRecordedVideos} from "../store/slice.ts";
import { IWithIndex } from "../../layout/model/constants.ts";
import { useVideoGridItemSize } from "../../layout/context/VideoGridContext.ts";

const RecordedVideo = memo<IWithIndex>(({index}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {width, height} = useVideoGridItemSize(index);

  const recordedVideosList = useAppSelector(selectRecordedVideos);

  const lastRecordedVideo = recordedVideosList[0]
    ? window.URL.createObjectURL(recordedVideosList[0])
    : undefined;

  if (!lastRecordedVideo) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      id="recorded-video-client"
      height={height}
      width={width}
      src={lastRecordedVideo}
      controls
    />
  )
})
RecordedVideo.displayName = "RecordedVideo";

export {
  RecordedVideo
}