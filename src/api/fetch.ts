export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions<TBody = unknown> {
  params?: Record<string, any>,
  data?: TBody,
  headers?: Record<string, string>,
  signal?: AbortSignal,
}

/**
 * API base URL (.env 에서 설정)
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8081'

/**
 * 쿼리스트링 붙이기
 */
function buildUrl(path: string, params?: Record<string, any>): string {
  const url = new URL(path, baseURL)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      url.searchParams.append(key, String(value))
    })
  }

  return url.toString()
}

/**
 * HTTP 에러용 커스텀 에러
 */
export class HttpError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown, message?: string) {
    super(message || `HTTP Error ${status}`)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

/**
 * 핵심 fetch 래퍼 함수
 */
async function coreRequest<TResponse = unknown, TBody = unknown>(
  method: HttpMethod,
  apiPath: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const { params, data, headers, signal } = options

  const url = buildUrl(apiPath, params)

  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
    signal,
  }

  if (data !== undefined && method !== 'GET') {
    init.body = JSON.stringify(data)
  }

  const res = await fetch(url, init)

  const contentType = res.headers.get('content-type') ?? ''

  let body: unknown = null
  try {
    if (contentType.includes('application/json')) {
      body = await res.json()
    } else {
      body = await res.text()
    }
  } catch {
    body = null
  }

  if (!res.ok) {
    throw new HttpError(res.status, body)
  }

  // 제네릭 타입에 맞춰 캐스팅
  return body as TResponse
}

/**
 * ✅ request.get / request.post / ... 형태로 노출
 */
export const fetchRequest = {
  get: <TResponse = unknown>(
    apiPath: string,
    params?: Record<string, any>,
    options: Omit<RequestOptions, 'params' | 'data'> = {},
  ) =>
    coreRequest<TResponse>('GET', apiPath, {
      ...options,
      params,
    }),

  post: <TResponse = unknown, TBody = unknown>(
    apiPath: string,
    data?: TBody,
    options: Omit<RequestOptions<TBody>, 'params' | 'data'> = {},
  ) =>
    coreRequest<TResponse, TBody>('POST', apiPath, {
      ...options,
      data,
    }),

  put: <TResponse = unknown, TBody = unknown>(
    apiPath: string,
    data?: TBody,
    options: Omit<RequestOptions<TBody>, 'params' | 'data'> = {},
  ) =>
    coreRequest<TResponse, TBody>('PUT', apiPath, {
      ...options,
      data,
    }),

  patch: <TResponse = unknown, TBody = unknown>(
    apiPath: string,
    data?: TBody,
    options: Omit<RequestOptions<TBody>, 'params' | 'data'> = {},
  ) =>
    coreRequest<TResponse, TBody>('PATCH', apiPath, {
      ...options,
      data,
    }),

  delete: <TResponse = unknown>(
    apiPath: string,
    params?: Record<string, any>,
    options: Omit<RequestOptions, 'params' | 'data'> = {},
  ) =>
    coreRequest<TResponse>('DELETE', apiPath, {
      ...options,
      params,
    }),
}
