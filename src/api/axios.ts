// src/api/api.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

/**
 * 공통 요청 옵션 타입
 */
export interface RequestOptions<TBody = unknown> {
  params?: Record<string, any>,   // query string
  data?: TBody,                   // body
  headers?: Record<string, string>,
  signal?: AbortSignal,
  config?: AxiosRequestConfig,
}

/**
 * baseURL 환경변수
 */
const baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:8081'

/**
 * 공통 axios 인스턴스
 */
const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 요청 인터셉터
 */
apiClient.interceptors.request.use(
  config => {
    // ✅ 토큰 자동 주입 예시
    // const token = localStorage.getItem('access_token')
    // if (token) {
    //   config.headers = config.headers ?? {}
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  error => Promise.reject(error),
)

/**
 * 응답 인터셉터
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    // ✅ 공통 에러 처리 구간
    return Promise.reject(error)
  },
)

/**
 * ✅ request.get / post / put / patch / delete 방식
 */
export const axiosRequest = {
  get: async <TResponse = unknown>(
    apiPath: string,
    params?: Record<string, any>,
    options: Omit<RequestOptions, 'params' | 'data'> = {},
  ): Promise<TResponse> => {
    const res = await apiClient.get<TResponse>(apiPath, {
      params,
      ...options.config,
      headers: options.headers,
      signal: options.signal,
    })

    return res.data
  },

  post: async <TResponse = unknown, TBody = unknown>(
    apiPath: string,
    data?: TBody,
    options: Omit<RequestOptions<TBody>, 'params' | 'data'> = {},
  ): Promise<TResponse> => {
    const res = await apiClient.post<TResponse>(apiPath, data, {
      ...options.config,
      headers: options.headers,
      signal: options.signal,
    })

    return res.data
  },

  put: async <TResponse = unknown, TBody = unknown>(
    apiPath: string,
    data?: TBody,
    options: Omit<RequestOptions<TBody>, 'params' | 'data'> = {},
  ): Promise<TResponse> => {
    const res = await apiClient.put<TResponse>(apiPath, data, {
      ...options.config,
      headers: options.headers,
      signal: options.signal,
    })

    return res.data
  },

  patch: async <TResponse = unknown, TBody = unknown>(
    apiPath: string,
    data?: TBody,
    options: Omit<RequestOptions<TBody>, 'params' | 'data'> = {},
  ): Promise<TResponse> => {
    const res = await apiClient.patch<TResponse>(apiPath, data, {
      ...options.config,
      headers: options.headers,
      signal: options.signal,
    })

    return res.data
  },

  delete: async <TResponse = unknown>(
    apiPath: string,
    params?: Record<string, any>,
    options: Omit<RequestOptions, 'params' | 'data'> = {},
  ): Promise<TResponse> => {
    const res = await apiClient.delete<TResponse>(apiPath, {
      params,
      ...options.config,
      headers: options.headers,
      signal: options.signal,
    })

    return res.data
  },
}

export { apiClient }
