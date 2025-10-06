import axios from 'axios';
import { setAuth } from '@/store/authSlice';

export const login = (credentials) => async (dispatch) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, credentials);
        dispatch(setAuth(res.data));
        localStorage.setItem('tokens', JSON.stringify({
  accessToken: res.data.tokens.accessToken,
  refreshToken: res.data.tokens.refreshToken,
}));

        localStorage.setItem('role', res.data.role);
        return res;
    }
    catch (error) {
        console.error("Login failed:", error);
        return Promise.reject(error);
    }
}