import { createSlice } from "@reduxjs/toolkit";
import { Phone } from "lucide-react";

const authSlice = createSlice({
    name: "auth",
    initialState: { role: 'user', tokens: null, isAuthenticated: true, dept: null, email: null, Phone: null, id: 'user123', locality: null, name: null, avatar: null},
    reducers: {
        setAuth: (state, action) => {
            state.role = action.payload.role;
            state.tokens = action.payload.tokens;
            state.isAuthenticated = true;
            //state.details = action.payload;
            state.email = action.payload.email;
            if(role === "manager" || role === "staff") {
                state.dept = action.payload.deptName;
            }
            if(role === "user") {
                state.locality = action.payload.locality;
                state.phone = action.payload.phone;
                state.id = action.payload.username;
                state.avatar = action.payload.avatar;
            }
            if(role === "staff"){
                state.name = action.payload.name;
                state.id = action.payload.staffId;
            }
            if(role === "manager"){
                state.id = action.payload.managerId;
            }

        },

        clearAuth: (state) => {
            state.role = "user";
            state.tokens = null;
            state.isAuthenticated = false;
            state.deptName = null;
        }
}
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;