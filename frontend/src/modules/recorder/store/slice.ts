import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../../store";

interface ISharedScreenSlice {
  mediaRecorder: MediaRecorder | null;
  currentRecordedBlobs: Blob[];
  currentRecordingStream: MediaStream | null;

  recordedVideos: Blob[];
}

const initialSlice: ISharedScreenSlice = {
  mediaRecorder: null,
  currentRecordedBlobs: [],
  currentRecordingStream: null,

  recordedVideos: [],
};

export const mediaRecorderDataAvailableThunk = createAsyncThunk(
  'recorder/handleDataAvailable',
  async (data: Blob) => {
    console.log("HANDLE DATA THUNK")
    return data;
  }
);

export const stopRecordingThunk = createAsyncThunk(
  'recorder/handleStopRecording',
  async (_, {getState, dispatch}) => {
    const state = getState() as RootState;
    const blobs = state.recorder.currentRecordedBlobs;
    const newVideo = new Blob(blobs);
    // const newVideo = new Blob(blobs, {type: 'video/webm'});

    console.log("STOP RECORDING THUNK")
    dispatch(clearRecordingState());
    return newVideo;
  }
);

export const startRecordingThunk = createAsyncThunk(
  "recorder/startRecording",
  async (stream: MediaStream, {dispatch}) => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      dispatch(mediaRecorderDataAvailableThunk(e.data));
    };

    mediaRecorder.onstop = () => {
      dispatch(stopRecordingThunk());
    };

    mediaRecorder.start();
    return mediaRecorder;
  }
);

const recorderSlice = createSlice({
  name: 'recorder',
  initialState: initialSlice,
  reducers: {
    setRecorderStopRecording: (state) => {
      if (state.mediaRecorder) {
        state.mediaRecorder.stop();
      }
    },
    clearRecordingState: (state) => {
      state.mediaRecorder = null;
      state.currentRecordedBlobs = [];
      state.currentRecordingStream = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startRecordingThunk.fulfilled, (state, action) => {
        state.mediaRecorder = action.payload;
        state.currentRecordedBlobs = [];
      })
      .addCase(mediaRecorderDataAvailableThunk.fulfilled, (state, action) => {
        state.currentRecordedBlobs.push(action.payload);
      })
      .addCase(stopRecordingThunk.fulfilled, (state, action) => {
        state.recordedVideos.push(action.payload);
        console.log("RECORDER STOPPED");
      });
  },
})

export const selectRecordedVideos = (state: RootState) => state.recorder.recordedVideos;
export const selectRecorderIsRecording = (state: RootState) => !!state.recorder.mediaRecorder;
export const selectHaveRecordedVideos = (state: RootState) => state.recorder.recordedVideos.length > 0;

export const {
  setRecorderStopRecording,
  clearRecordingState
} = recorderSlice.actions

export {
  recorderSlice,
}