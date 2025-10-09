import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



export const fetchStaffByDept = createAsyncThunk('staff/fetchByDept', async (deptName) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/staff?department=${deptName}`);
    return response.data;
});

const staffSlice = createSlice({
    name: 'staff',
    initialState: { members: [], status: 'idle' },
    extraReducers: (builder) => {
        builder.addCase(fetchStaffByDept.fulfilled, (state, action) => {
            state.members = action.payload;
        });
    },
});

export default staffSlice.reducer;