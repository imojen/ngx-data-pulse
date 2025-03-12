export interface ApiHeaders {
  [key: string]: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  data?: unknown;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestConfig<D = unknown> {
  method: HttpMethod;
  url: string;
  data?: D;
  headers?: ApiHeaders;
  responseType?: "json" | "text" | "blob" | "arraybuffer";
}
