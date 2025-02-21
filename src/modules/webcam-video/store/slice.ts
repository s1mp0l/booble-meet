import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../../store";

interface IWebCamVideoSlice {
  selfWebCamVideoStream: MediaStream | null;
  isMuted: boolean;
  isVideoHidden: boolean;
}

const initialSlice: IWebCamVideoSlice = {
  selfWebCamVideoStream: null,
  isMuted: false,
  isVideoHidden: false,
};

const webCamVideoSlice = createSlice({
  name: 'webCamVideo',
  initialState: initialSlice,
  reducers: {
    setWebCamVideoStream: (state, action: PayloadAction<MediaStream | null>) => {
      state.selfWebCamVideoStream = action.payload;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    toggleVideo: (state) => {
      state.isVideoHidden = !state.isVideoHidden;
    },
  },
})

export const selectSelfWebCamVideoStream = (state: RootState) => state.webCamVideo.selfWebCamVideoStream;
export const selectIsMuted = (state: RootState) => state.webCamVideo.isMuted;
export const selectIsVideoHidden = (state: RootState) => state.webCamVideo.isVideoHidden;

export const {
  setWebCamVideoStream,
  toggleMute,
  toggleVideo,
} = webCamVideoSlice.actions

export {
  webCamVideoSlice,
}