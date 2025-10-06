import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { role: "user", tokens: null, isAuthenticated: false, dept: null },
    reducers: {
        setAuth: (state, action) => {
            state.role = action.payload.role;
            state.tokens = action.payload.tokens;
            state.isAuthenticated = true;
            if(role === "manager" || role === "staff") {
                dept = action.payload.dept;
        }
    },

        clearAuth: (state) => {
            state.role = "user";
            state.tokens = null;
            state.isAuthenticated = false;
            state.dept = null;
        }
}
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;