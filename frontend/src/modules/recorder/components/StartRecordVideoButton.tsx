import {memo, useCallback} from "react";
import {useAppDispatch, useAppSelector} from "../../../store/hooks.ts";
import {selectSelfSharedScreenStream} from "../../share-screen/store/slice.ts";
import {Button} from "antd";
import {selectRecorderIsRecording, setRecorderStopRecording, startRecordingThunk} from "../store/slice.ts";

const StartRecordVideoButton = memo(() => {
  const dispatch = useAppDispatch();

  const sharedScreenStreamFromStore = useAppSelector(selectSelfSharedScreenStream);
  const isRecording = useAppSelector(selectRecorderIsRecording);

  const stopRecording = useCallback(() => {
      if (!isRecording) {
        return;
      }

      dispatch(setRecorderStopRecording());
    },
    [dispatch, isRecording]
  );

  const startRecording = useCallback(() => {
      if (!sharedScreenStreamFromStore) {
        return;
      }

      dispatch(startRecordingThunk(sharedScreenStreamFromStore));
    },
    [dispatch, sharedScreenStreamFromStore]
  );

  return (
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      type={"default"}
      danger={isRecording}
      disabled={!sharedScreenStreamFromStore}
    >
      {isRecording ? "Stop recording" : "Start recording"}
    </Button>
  )
})
StartRecordVideoButton.displayName = "StartRecordVideoButton";

export {
  StartRecordVideoButton
}