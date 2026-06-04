import request from "@/services/http";
import { type ApiQuery, type ApiRequestBody, type ApiResponseData } from "@/types";

export const fetchCategoryList = (params: ApiQuery<"/user/category/list", "get">) => {
  return request<ApiResponseData<"/user/category/list", "get">, never, ApiQuery<"/user/category/list", "get">>({
    url: "/user/category/list",
    method: "get",
    params,
  });
};

export const fetchDishList = (params: ApiQuery<"/user/dish/list", "get">) => {
  return request<ApiResponseData<"/user/dish/list", "get">, never, ApiQuery<"/user/dish/list", "get">>({
    url: "/user/dish/list",
    method: "get",
    params,
  });
};

export const fetchSetmealList = (params: ApiQuery<"/user/setmeal/list", "get">) => {
  return request<ApiResponseData<"/user/setmeal/list", "get">, never, ApiQuery<"/user/setmeal/list", "get">>({
    url: "/user/setmeal/list",
    method: "get",
    params,
  });
};

export const fetchShoppingCartList = () => {
  return request<ApiResponseData<"/user/shoppingCart/list", "get">, never, never>({
    url: "/user/shoppingCart/list",
    method: "get",
  });
};

export const addShoppingCart = (params: ApiRequestBody<"/user/shoppingCart/add", "post">) => {
  return request<
    ApiResponseData<"/user/shoppingCart/add", "post">,
    ApiRequestBody<"/user/shoppingCart/add", "post">,
    never
  >({
    url: "/user/shoppingCart/add",
    method: "post",
    data: { ...params },
  });
};

export const subShoppingCart = (params: ApiRequestBody<"/user/shoppingCart/sub", "post">) => {
  return request<
    ApiResponseData<"/user/shoppingCart/sub", "post">,
    ApiRequestBody<"/user/shoppingCart/sub", "post">,
    never
  >({
    url: "/user/shoppingCart/sub",
    method: "post",
    data: { ...params },
  });
};

export const cleanShoppingCart = () => {
  return request<ApiResponseData<"/user/shoppingCart/clean", "delete">, never, never>({
    url: "/user/shoppingCart/clean",
    method: "delete",
  });
};
