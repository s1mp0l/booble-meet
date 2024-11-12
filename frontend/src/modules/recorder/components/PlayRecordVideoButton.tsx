import {memo} from "react";
import {useAppSelector} from "../../../store/hooks.ts";
import {Button} from "antd";
import {selectRecorderIsRecording} from "../store/slice.ts";

const PLayRecordVideoButton = memo(() => {
  const isRecording = useAppSelector(selectRecorderIsRecording);

  return (
    <Button
      type={"dashed"}
      danger
      disabled={isRecording}
    >
      {"Start recording"}
    </Button>
  )
})
PLayRecordVideoButton.displayName = "StartRecordVideoButton";

export {
  PLayRecordVideoButton
}