import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/complaints`;

export const fetchComplaints = createAsyncThunk(
    'complaints/fetchAll',  // createSlice m name hai complaints + action name fetchAll
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addComplaint = createAsyncThunk(
    'complaints/addComplaint',
    async (complaintData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, complaintData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteComplaint = createAsyncThunk(
    'complaints/deleteComplaint',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}${id}`);
            return id; 
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    items: [],
    status: 'idle', // idle, loading, succeeded,  failed
    error: null,
    filters: {
        type: [], // For department
        locality: [],
        status: [],
        sortBy: 'newer', // 'newer', 'older', 'timeLeft_asc', 'completion_time'
        startDate: null,
        endDate: null 
    }
};

export const complaintSlice = createSlice({
    name: 'complaints',
    initialState,
    // for web socket nhi use karna hai toh yeh reducers hata do and update the items in extraReducers
    reducers: {
        complaintAdded: (state, action) => {
            state.items.push(action.payload);
        },
        complaintDeleted: (state, action) => {
            state.items = state.items.filter(complaint => complaint.id !== action.payload);
        },
         setFilter: (state, action) => {
            const { filterName, value } = action.payload;

            if (Array.isArray(state.filters[filterName])) {
                const currentArray = state.filters[filterName];
                if (currentArray.includes(value)) {
                    state.filters[filterName] = currentArray.filter(item => item !== value);
                } else {
                    currentArray.push(value);
                }
            } else {
                state.filters[filterName] = value;
            }
        },
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComplaints.pending, (state) => {  
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchComplaints.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchComplaints.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addComplaint.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(deleteComplaint.fulfilled, (state, action) => {
                state.items = state.items.filter(complaint => complaint.id !== action.payload);
            });
    },
});
export const { setFilter } = complaintSlice.actions;
export const { complaintAdded, complaintDeleted } = complaintSlice.actions;
export default complaintSlice.reducer;