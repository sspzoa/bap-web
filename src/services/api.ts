import { CONFIG } from '@/config';
import { ApiError, NetworkError, TimeoutError } from '@/utils/errors';
import { apiLogger } from '@/utils/logger';

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

class ApiService {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultRetryDelay: number;

  constructor() {
    this.baseUrl = CONFIG.API.BASE_URL;
    this.defaultTimeout = CONFIG.API.TIMEOUT;
    this.defaultRetries = CONFIG.API.RETRY.COUNT;
    this.defaultRetryDelay = CONFIG.API.RETRY.DELAY;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
      ...fetchOptions
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const method = fetchOptions.method || 'GET';

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = retryDelay * 2 ** (attempt - 1);
          apiLogger.info('Retrying request', { attempt, delay, endpoint });
          await this.sleep(delay);
        }

        const timer = apiLogger.time(`API ${method} ${endpoint}`);
        const response = await this.fetchWithTimeout(url, fetchOptions, timeout);

        const responseData = await this.parseResponse<T>(response);

        const duration = (timer as unknown as () => number) ? (timer as unknown as () => number)() : undefined;
        apiLogger.api(method, endpoint, response.status, duration);
        if (!response.ok) {
          throw ApiError.fromResponse(response, responseData);
        }

        return responseData;
      } catch (error) {
        lastError = this.normalizeError(error);

        if (!this.shouldRetry(lastError, attempt, retries)) {
          throw lastError;
        }
      }
    }

    throw lastError || new Error('Failed after all retries');
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new TimeoutError();
        }
        if (error.message.includes('fetch')) {
          throw new NetworkError();
        }
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return response.json();
    }

    throw new Error('Invalid response content type');
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof NetworkError || error instanceof TimeoutError) {
      return error;
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error('Unknown error occurred');
  }

  private shouldRetry(error: Error, attempt: number, maxRetries: number): boolean {
    if (attempt >= maxRetries) {
      return false;
    }

    if (error instanceof ApiError) {
      return error.isRetryable();
    }

    return error instanceof NetworkError || error instanceof TimeoutError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
