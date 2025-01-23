import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../../store';

interface ConnectedUser {
    username: string;
    roomId: string;
    socketId: string;
    userId: string;
}

interface ConferenceState {
    roomId: string | null;
    username: string | null;
    userId: string | null;
    token: string | null;
    conferenceUrl: string | null;
    error: string | null;
    isLoading: boolean;
    isConnected: boolean;
    wsError: string | null;
    connectedUsers: ConnectedUser[];
}

const initialState: ConferenceState = {
    roomId: null,
    username: null,
    userId: null,
    token: null,
    conferenceUrl: null,
    error: null,
    isLoading: false,
    isConnected: false,
    wsError: null,
    connectedUsers: [],
};

// Функция для генерации userId из username
const generateUserId = (username: string): string => {
    return username.toLowerCase().replace(/\s+/g, '_');
};

export const createConference = createAsyncThunk(
    'conference/create',
    async (username: string) => {
        const response = await axios.post('/api/conference/create', { 
            username,
            userId: generateUserId(username)
        });
        return response.data;
    }
);

export const joinConference = createAsyncThunk(
    'conference/join',
    async ({ roomId, username }: { roomId: string; username: string }) => {
        const response = await axios.post(`/api/conference/join/${roomId}`, { 
            username,
            userId: generateUserId(username)
        });
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
        wsConnected: (state) => {
            state.isConnected = true;
            state.wsError = null;
        },
        wsDisconnected: (state) => {
            state.isConnected = false;
        },
        wsError: (state, action: PayloadAction<string>) => {
            state.wsError = action.payload;
            state.isConnected = false;
        },
        setConnectedUsers: (state, action: PayloadAction<ConnectedUser[]>) => {
            state.connectedUsers = action.payload.filter(user => user.username !== state.username);
        },
        addConnectedUser: (state, action: PayloadAction<ConnectedUser>) => {
            if (!state.connectedUsers.some(user => user.userId === action.payload.userId)) {
                state.connectedUsers.push(action.payload);
            }
        },
        removeConnectedUser: (state, action: PayloadAction<string>) => {
            state.connectedUsers = state.connectedUsers.filter(
                user => user.socketId !== action.payload
            );
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
                state.userId = generateUserId(action.meta.arg);
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
                state.userId = generateUserId(action.meta.arg.username);
            })
            .addCase(joinConference.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to join conference';
            });
    },
});

// Селекторы
export const selectConferenceState = (state: RootState) => state.conference;
export const selectWebSocketState = (state: RootState) => ({
    isConnected: state.conference.isConnected,
    error: state.conference.wsError
});
export const selectConnectedUsers = (state: RootState) => state.conference.connectedUsers;

export const { 
    resetConference, 
    setError,
    wsConnected,
    wsDisconnected,
    wsError,
    setConnectedUsers,
    addConnectedUser,
    removeConnectedUser
} = conferenceSlice.actions;

export default conferenceSlice.reducer; 