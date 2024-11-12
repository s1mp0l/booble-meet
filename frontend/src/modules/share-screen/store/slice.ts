import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../../store";

interface ISharedScreenSlice {
  selfSharedScreenStream: MediaStream | null;
}

const initialSlice: ISharedScreenSlice = {
  selfSharedScreenStream: null
};

const sharedScreenSlice = createSlice({
  name: 'SharedScreen',
  initialState: initialSlice,
  reducers: {
    setSharedScreen: (state, action: PayloadAction<MediaStream | null>) => {
      state.selfSharedScreenStream = action.payload;
    },
  },
})

export const selectSelfSharedScreenStream = (state: RootState) => state.sharedScreen.selfSharedScreenStream;

export const {
  setSharedScreen,
} = sharedScreenSlice.actions

export {
  sharedScreenSlice,
}