import { configureStore } from '@reduxjs/toolkit';

// 1. Import the reducers from your slices
import complaintsReducer from '../slices/complaintSlice';
import authReducer from '../slices/authSlice';
import staffReducer from '../slices/staffSlice';

export const store = configureStore({
  // 2. Combine all reducers into a single root reducer object
  reducer: {
    complaints: complaintsReducer,
    auth: authReducer,
    staff: staffReducer,
  },
});