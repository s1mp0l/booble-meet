import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebSocketState {
    isConnected: boolean;
    error: string | null;
}

const initialState: WebSocketState = {
    isConnected: false,
    error: null,
};

const webSocketSlice = createSlice({
    name: 'webSocket',
    initialState,
    reducers: {
        wsConnected: (state) => {
            state.isConnected = true;
            state.error = null;
        },
        wsDisconnected: (state) => {
            state.isConnected = false;
        },
        wsError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isConnected = false;
        },
    },
});

export const { wsConnected, wsDisconnected, wsError } = webSocketSlice.actions;
export default webSocketSlice.reducer; 