// API client with error handling and retry logic
export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retry?: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRY = 2;

export async function apiCall<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = DEFAULT_TIMEOUT,
    retry = DEFAULT_RETRY,
  } = options;

  const baseUrl = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || ''
    : '';
  
  const url = `${baseUrl}${endpoint}`;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        credentials: 'include', // Include cookies for JWT
      });

      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          error: data?.error || data || 'API error',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      lastError = error as Error;

      if (attempt < retry) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  return {
    error: lastError?.message || 'Failed to fetch',
    status: 0,
  };
}

export function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
