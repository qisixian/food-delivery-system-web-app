// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// 把从redux里读取数据（store.getState）封装成类型，用来实现自动推断类型
export type RootState = ReturnType<typeof store.getState>;

// 把存数据进入redux（store.dispatch）封装成类型，可能能避免一些bug？
export type AppDispatch = typeof store.dispatch;
