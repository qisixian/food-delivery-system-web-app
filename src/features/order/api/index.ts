import request from "@/services/http";
import { type ApiPathParams, type ApiRequestBody, type ApiResponseData } from "@/types";

export const submitOrder = (params: ApiRequestBody<"/user/order/submit", "post">) => {
  return request<ApiResponseData<"/user/order/submit", "post">, ApiRequestBody<"/user/order/submit", "post">, never>({
    url: "/user/order/submit",
    method: "post",
    data: { ...params },
  });
};

export const payOrder = (params: ApiRequestBody<"/user/order/payment", "put">) => {
  return request<ApiResponseData<"/user/order/payment", "put">, ApiRequestBody<"/user/order/payment", "put">, never>({
    url: "/user/order/payment",
    method: "put",
    data: { ...params },
  });
};

export const fetchOrderList = () => {
  return request<ApiResponseData<"/user/order/list", "get">, never, never>({
    url: `/user/order/list`,
    method: "get",
  });
};

export const fetchOrderDetail = (params: ApiPathParams<"/user/order/{orderNumber}", "get">) => {
  return request<ApiResponseData<"/user/order/{orderNumber}", "get">, never, never>({
    url: `/user/order/${params.orderNumber}`,
    method: "get",
  });
};
