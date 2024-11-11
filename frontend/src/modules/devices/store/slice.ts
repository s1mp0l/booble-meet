import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMediaDevices} from "../utils/getDevices.ts";
import {RootState} from "../../../store";

interface IDevicesSlice extends IMediaDevices {
  activeVideoDevice: MediaDeviceInfo | null,
  activeAudioOutputDevice: MediaDeviceInfo | null,
  activeAudioInputDevice: MediaDeviceInfo | null,
}

const initialSlice: IDevicesSlice = {
  videoDevices: [],
  audioOutputDevices: [],
  audioInputDevices: [],

  activeVideoDevice: null,
  activeAudioOutputDevice: null,
  activeAudioInputDevice: null,
};

const devicesSlice = createSlice({
  name: 'devices',
  initialState: initialSlice,
  reducers: {
    setDevices: (state, action: PayloadAction<IMediaDevices>) => {
      const {
        videoDevices,
        audioOutputDevices,
        audioInputDevices,
      } = action.payload;

      state.videoDevices = videoDevices;
      state.audioOutputDevices = audioOutputDevices;
      state.audioInputDevices = audioInputDevices;
    },
    setActiveVideoDevice: (state, action: PayloadAction<string>) => {
      const devices = state.videoDevices;
      const newDevice = devices.find(it => it.deviceId === action.payload)

      if (newDevice) {
        state.activeVideoDevice = newDevice;
      }
    },
    setActiveAudioInputDevice: (state, action: PayloadAction<string>) => {
      const devices = state.audioInputDevices;
      const newDevice = devices.find(it => it.deviceId === action.payload)

      if (newDevice) {
        state.activeAudioInputDevice = newDevice;
      }
    },
    setActiveAudioOutputDevice: (state, action: PayloadAction<string>) => {
      const devices = state.audioOutputDevices;
      const newDevice = devices.find(it => it.deviceId === action.payload)

      if (newDevice) {
        state.activeAudioOutputDevice = newDevice;
      }
    },
  },
})

export const selectVideoDevices = (state: RootState) => state.devices.videoDevices;
export const selectAudioOutputDevices = (state: RootState) => state.devices.audioOutputDevices;
export const selectAudioInputDevices = (state: RootState) => state.devices.audioInputDevices;

export const selectActiveVideoDevice = (state: RootState) => state.devices.activeVideoDevice;
export const selectActiveAudioInputDevice = (state: RootState) => state.devices.activeAudioInputDevice;
export const selectActiveAudioOutputDevice = (state: RootState) => state.devices.activeAudioOutputDevice;

export const selectAllActiveDevices = createSelector(
  [
    selectActiveVideoDevice,
    selectActiveAudioInputDevice,
    selectActiveAudioOutputDevice
  ],
  (video, audioInput, audioOutput) => ({
    video: video,
    audioInput: audioInput,
    audioOutput: audioOutput,
  })
);

export const {
  setDevices,
  setActiveVideoDevice,
  setActiveAudioInputDevice,
  setActiveAudioOutputDevice,
} = devicesSlice.actions

export {
  devicesSlice,
}