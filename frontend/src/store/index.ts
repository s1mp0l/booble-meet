import {configureStore} from '@reduxjs/toolkit'
import {devicesSlice} from "../modules/devices/store/slice.ts";
import {sharedScreenSlice} from "../modules/share-screen/store/slice.ts";

const store = configureStore({
  reducer: {
    devices: devicesSlice.reducer,
    sharedScreen: sharedScreenSlice.reducer,
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