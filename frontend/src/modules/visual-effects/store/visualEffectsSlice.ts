import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { BackgroundEffect, FaceMaskType } from '../model/types';

interface VisualEffectsState {
  backgroundEffect: BackgroundEffect;
  faceMask: FaceMaskType | 'none';
  isEffectsDrawerOpen: boolean;
  effectsStream: MediaStream | null;
}

const initialState: VisualEffectsState = {
  backgroundEffect: { type: 'none' },
  faceMask: 'none',
  isEffectsDrawerOpen: false,
  effectsStream: null
};

const visualEffectsSlice = createSlice({
  name: 'visualEffects',
  initialState,
  reducers: {
    setBackgroundEffect: (state, action: PayloadAction<BackgroundEffect>) => {
      state.backgroundEffect = action.payload;
    },
    setFaceMask: (state, action: PayloadAction<FaceMaskType>) => {
      state.faceMask = action.payload;
    },
    toggleEffectsDrawer: (state) => {
      state.isEffectsDrawerOpen = !state.isEffectsDrawerOpen;
    },
    disableAllEffects: (state) => {
      state.backgroundEffect = { type: 'none' };
      state.faceMask = 'none';
    },
    setEffectsStream: (state, action: PayloadAction<MediaStream | null>) => {
      if (state.effectsStream) {
        state.effectsStream.getTracks().forEach(track => track.stop());
      }
      state.effectsStream = action.payload;
    }
  }
});

export const { 
  setBackgroundEffect, 
  setFaceMask, 
  toggleEffectsDrawer,
  disableAllEffects,
  setEffectsStream
} = visualEffectsSlice.actions;

// Селекторы
export const selectBackgroundEffect = (state: RootState) => state.visualEffects.backgroundEffect;
export const selectFaceMask = (state: RootState) => state.visualEffects.faceMask;
export const selectIsEffectsDrawerOpen = (state: RootState) => state.visualEffects.isEffectsDrawerOpen;
export const selectEffectsStream = (state: RootState) => state.visualEffects.effectsStream;

export default visualEffectsSlice.reducer; 