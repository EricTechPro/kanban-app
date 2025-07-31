export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_REQUIRED');
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'ACCESS_DENIED');
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation error', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', { retryAfter });
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function handleApiError(error: unknown): never {
  // Log the error for debugging
  console.warn('[API] Handling error:', error);

  if (error instanceof Response) {
    throw new ApiError(
      `HTTP ${error.status}: ${error.statusText}`,
      error.status
    );
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      throw new ApiError('Request was cancelled', 0, 'CANCELLED');
    }

    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      throw new NetworkError('Network error: Please check your connection');
    }

    throw error;
  }

  throw new Error('An unknown error occurred');
}