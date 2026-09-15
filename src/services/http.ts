import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { store } from "@/app/store";
import type { ApiResponse } from "@/types";
import { enqueueSnackbar } from "notistack";
import { t } from "i18next";
import { logout } from "@/services/auth.ts";

export const http = axios.create({
  baseURL: "/api",
  timeout: 600000,
});

// do just before sending request
http.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers["token"] = token;
    }
    // else if (config.url !== "/admin/employee/login") {
    //   window.location.href = "/login";
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// do just after receiving response
http.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.data.code !== 1) {
      enqueueSnackbar(t(`error.${res.data.msg}`), { variant: "error" });
      console.error(res.data.message);
      if (res.data.msg === "UNAUTHENTICATED") logout();
    }
    return res.data;
  },
  // (error: AxiosError) => {
  (error) => {
    // if (error.response.data.status === 401 || error.status === 401) logout();
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export type RequestConfig<Body = unknown, Query = unknown> = Omit<AxiosRequestConfig<Body>, "data" | "params"> & {
  data?: Body;
  params?: Query;
};

export default function request<Data = unknown, Body = unknown, Query = unknown>(
  config: RequestConfig<Body, Query>
): Promise<ApiResponse<Data>> {
  return http.request<ApiResponse<Data>, ApiResponse<Data>, Body>(config as AxiosRequestConfig<Body>);
}

export function requestRaw<Res = unknown, Body = unknown, Query = unknown>(
  config: RequestConfig<Body, Query>
): Promise<Res> {
  return http.request<Res, Res, Body>(config as AxiosRequestConfig<Body>);
}
