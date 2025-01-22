import {configureStore} from '@reduxjs/toolkit'
import {devicesSlice} from "../modules/devices/store/slice.ts";
import {sharedScreenSlice} from "../modules/share-screen/store/slice.ts";
import {recorderSlice} from "../modules/recorder/store/slice.ts";
import {webCamVideoSlice} from "../modules/webcam-video/store/slice.ts";
import conferenceReducer from '../modules/conference/store/conferenceSlice';
import webSocketReducer from '../modules/conference/store/webSocketSlice';

const store = configureStore({
  reducer: {
    devices: devicesSlice.reducer,
    sharedScreen: sharedScreenSlice.reducer,
    webCamVideo: webCamVideoSlice.reducer,
    recorder: recorderSlice.reducer,
    conference: conferenceReducer,
    webSocket: webSocketReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export {
  store
}