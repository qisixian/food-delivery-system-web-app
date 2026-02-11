import type {components, paths} from "@/types/openapi";

export type ApiResponse<T = unknown> = components['schemas']['ResultBase'] & { data?: T };

export type PageResult<T = unknown> = {
    records: T[];
    total: number;
};


export type ApiPath = keyof paths;
export type ApiMethod = 'get' | 'put' | 'post' | 'delete' | 'patch' | 'options' | 'head' | 'trace';

type AnySchema = components['schemas'][keyof components['schemas']];
// if the type is a record of schemas, unwrap to the value type
type UnwrapSchemaWrapper<Q> = Q extends Record<string, AnySchema> ? Q[keyof Q] : Q;

type ApiOperation<Path extends ApiPath, Method extends ApiMethod> = NonNullable<paths[Path][Method]>;

export type ApiQuery<Path extends ApiPath, Method extends ApiMethod> =
    ApiOperation<Path, Method> extends { parameters: { query?: infer Query } } ? UnwrapSchemaWrapper<Query> : never;

export type ApiPathParams<Path extends ApiPath, Method extends ApiMethod> =
    ApiOperation<Path, Method> extends { parameters: { path?: infer Params } } ? Params : never;

export type ApiRequestBody<Path extends ApiPath, Method extends ApiMethod> =
    ApiOperation<Path, Method> extends { requestBody?: { content: infer Content } }
        ? Content extends Record<string, unknown>
            ? Content[keyof Content]
            : never
        : never;

type ApiResponse200<Path extends ApiPath, Method extends ApiMethod> =
    ApiOperation<Path, Method> extends { responses: { 200: infer Response } } ? Response : never;

type ApiResponseContent<Path extends ApiPath, Method extends ApiMethod> =
    ApiResponse200<Path, Method> extends { content?: infer Content } ? Content : never;

// extract the "value" of the "key" - response content type - like "*/*"
type ApiResponseBody<Path extends ApiPath, Method extends ApiMethod> =
    ApiResponseContent<Path, Method> extends Record<string, unknown>
        ? ApiResponseContent<Path, Method>[keyof ApiResponseContent<Path, Method>]
        : never;

export type ApiResponseData<Path extends ApiPath, Method extends ApiMethod> =
    ApiResponseBody<Path, Method> extends { data?: infer Data } ? Data : never;


// example usage:
// export type AdminCategoryDeleteParams = ApiQuery<'/admin/category', 'delete'>;
// export type AdminCategoryDeletePathParams = ApiPathParams<'/admin/category', 'delete'>;
// export type AdminCategoryDeleteBody = ApiRequestBody<'/admin/category', 'delete'>;
// export type AdminCategoryDeleteResult = ApiResponseBody<'/admin/category', 'delete'>;
// export type AdminCategoryDeleteData = ApiResponseData<'/admin/category', 'delete'>;
// export type AdminCategoryListParams = ApiQuery<'/admin/category/list', 'get'>;
// export type AdminCategoryListPathParams = ApiPathParams<'/admin/category/list', 'get'>;
// export type AdminCategoryListBody = ApiRequestBody<'/admin/category/list', 'get'>;
// export type AdminCategoryListResult = ApiResponseBody<'/admin/category/list', 'get'>;
// export type AdminCategoryListData = ApiResponseData<'/admin/category/list', 'get'>;

// example of raw usage:
// export type AdminCategoryPageQuery = paths['/admin/category/page']['get']['parameters']['query']['categoryPageQueryDTO'];
// export type AdminDishListQuery = paths['/admin/dish/list']['get']['parameters']['query']
// export type AdminCategoryPageResponse = paths['/admin/category/page']['get']['responses']['200']['content']['*/*']['data'];
// export type AdminCategoryDeleteQuery = paths["/admin/category"]["delete"]["parameters"]["query"]["id"];
// export type AdminCategoryDeleteResponse = paths["/admin/category"]["delete"]["responses"]["200"]["content"]["*/*"]["data"];