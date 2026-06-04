// src/store/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
  token: string | null;
  userId: string | null;
};

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  userId: localStorage.getItem("userId"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
      localStorage.setItem("userId", action.payload);
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
  },
});

export const { setToken, setUserId, clearToken } = authSlice.actions;
export default authSlice.reducer;
