export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    public readonly details?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: Response, data?: any): ApiError {
    const message = data?.error || ApiError.getDefaultMessage(response.status);
    return new ApiError(response.status, message, data?.code, data?.details);
  }

  static getDefaultMessage(status: number): string {
    switch (status) {
      case 400:
        return '잘못된 요청입니다';
      case 404:
        return '급식 정보가 없어요';
      case 429:
        return '너무 많은 요청을 보냈어요. 잠시 후 다시 시도해주세요';
      case 500:
        return '서버에 문제가 발생했어요';
      case 503:
        return '서비스를 일시적으로 사용할 수 없어요';
      default:
        return '알 수 없는 오류가 발생했어요';
    }
  }

  isRetryable(): boolean {
    return [408, 429, 500, 502, 503, 504].includes(this.status);
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  isServerError(): boolean {
    return this.status >= 500;
  }
}

export class NetworkError extends Error {
  constructor(message = '네트워크 연결을 확인해주세요') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message = '요청 시간이 초과되었어요') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: any,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof TimeoutError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function formatErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (isNetworkError(error)) {
    return error.message;
  }

  if (isTimeoutError(error)) {
    return error.message;
  }

  if (isValidationError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했어요';
}
