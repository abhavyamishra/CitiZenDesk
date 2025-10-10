import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// The URL for your backend endpoint that provides the initial stats
const API_URL = 'http://localhost:3001/api/stats';

// Action to fetch the initial stats data from your backend
export const fetchStats = createAsyncThunk(
    'stats/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    data: {
        
  
  departmentCounts: {
    water: 18,
    garbage: 26,
    road: 34
  },

  complaintStatus: {
    active: 8,           
    elapsed: 8,        
    processing: 6,        
    completed_ontime: 22,  
    completed_late: 5,     
    closed: 11            
  },

  urgencyCounts: {
    critical: 5,
    high: 15,
    medium: 28,
    low: 30
  },

  avgResolutionTimeHours: 42.7 
    },       // This object will hold all your calculated stats
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    // Reducers for synchronous actions, like updates from WebSockets
    reducers: {
        updateStats: (state, action) => {
            state.data = action.payload;
            state.status = 'succeeded';
        },
    },
    // Reducers for asynchronous actions created with createAsyncThunk
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { updateStats } = statsSlice.actions;

export default statsSlice.reducer;