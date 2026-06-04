import request from "@/services/http";
import { type ApiPathParams, type ApiQuery, type ApiRequestBody, type ApiResponseData } from "@/types";

export const fetchMe = () => {
  return request<ApiResponseData<"/user/user/me", "get">, never, never>({
    url: `/user/user/me`,
    method: "get",
  });
};

export const fetchAddressList = () => {
  return request<ApiResponseData<"/user/addressBook/list", "get">, never, never>({
    url: "/user/addressBook/list",
    method: "get",
  });
};

export const fetchAddress = (params: ApiPathParams<"/user/addressBook/{id}", "get">) => {
  return request<ApiResponseData<"/user/addressBook/{id}", "get">, never, never>({
    url: `/user/addressBook/${params.id}`,
    method: "get",
  });
};

export const addAddress = (params: ApiRequestBody<"/user/addressBook", "post">) => {
  return request<ApiResponseData<"/user/addressBook", "post">, ApiRequestBody<"/user/addressBook", "post">, never>({
    url: "/user/addressBook",
    method: "post",
    data: { ...params },
  });
};

export const updateAddress = (params: ApiRequestBody<"/user/addressBook", "put">) => {
  return request<ApiResponseData<"/user/addressBook", "put">, ApiRequestBody<"/user/addressBook", "put">, never>({
    url: "/user/addressBook",
    method: "put",
    data: { ...params },
  });
};

export const deleteAddress = (params: ApiQuery<"/user/addressBook", "delete">) => {
  return request<ApiResponseData<"/user/addressBook", "delete">, never, ApiQuery<"/user/addressBook", "delete">>({
    url: "/user/addressBook",
    method: "delete",
    params,
  });
};

export const fetchDefaultAddress = () => {
  return request<ApiResponseData<"/user/addressBook/default", "get">, never, never>({
    url: "/user/addressBook/default",
    method: "get",
  });
};

export const setDefaultAddress = (params: ApiRequestBody<"/user/addressBook/default", "put">) => {
  return request<
    ApiResponseData<"/user/addressBook/default", "put">,
    ApiRequestBody<"/user/addressBook/default", "put">,
    never
  >({
    url: "/user/addressBook/default",
    method: "put",
    data: { ...params },
  });
};
