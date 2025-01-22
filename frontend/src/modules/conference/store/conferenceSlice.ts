import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ConferenceState {
    roomId: string | null;
    username: string | null;
    token: string | null;
    conferenceUrl: string | null;
    error: string | null;
    isLoading: boolean;
}

const initialState: ConferenceState = {
    roomId: null,
    username: null,
    token: null,
    conferenceUrl: null,
    error: null,
    isLoading: false,
};

export const createConference = createAsyncThunk(
    'conference/create',
    async (username: string) => {
        const response = await axios.post('/api/conference/create', { username });
        return response.data;
    }
);

export const joinConference = createAsyncThunk(
    'conference/join',
    async ({ roomId, username }: { roomId: string; username: string }) => {
        const response = await axios.post(`/api/conference/join/${roomId}`, { username });
        return response.data;
    }
);

const conferenceSlice = createSlice({
    name: 'conference',
    initialState,
    reducers: {
        resetConference: () => {
            return initialState;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createConference.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createConference.fulfilled, (state, action) => {
                state.isLoading = false;
                state.roomId = action.payload.roomId;
                state.token = action.payload.token;
                state.conferenceUrl = action.payload.conferenceUrl;
                state.username = action.meta.arg;
            })
            .addCase(createConference.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to create conference';
            })
            .addCase(joinConference.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(joinConference.fulfilled, (state, action) => {
                state.isLoading = false;
                state.roomId = action.payload.roomId;
                state.token = action.payload.token;
                state.conferenceUrl = action.payload.conferenceUrl;
                state.username = action.meta.arg.username;
            })
            .addCase(joinConference.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to join conference';
            });
    },
});

export const { resetConference, setError } = conferenceSlice.actions;
export default conferenceSlice.reducer; 