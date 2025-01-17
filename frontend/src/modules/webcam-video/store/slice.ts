import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../../store";

interface IWebCamVideoSlice {
  selfWebCamVideoStream: MediaStream | null;
}

const initialSlice: IWebCamVideoSlice = {
  selfWebCamVideoStream: null,
};

const webCamVideoSlice = createSlice({
  name: 'webCamVideo',
  initialState: initialSlice,
  reducers: {
    setWebCamVideoStream: (state, action: PayloadAction<MediaStream | null>) => {
      state.selfWebCamVideoStream = action.payload;
    },
  },
})

export const selectSelfWebCamVideoStream = (state: RootState) => state.webCamVideo.selfWebCamVideoStream;

export const {
  setWebCamVideoStream,
} = webCamVideoSlice.actions

export {
  webCamVideoSlice,
}