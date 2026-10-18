// Viens kļūdas tips visam API slānim.
export class ApiError extends Error {
  constructor({ code, message, status = 0, cause }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.cause = cause;
  }

  // Vai kļūda ir savienojuma, nevis servera atbildes problēma.
  get isNetwork() {
    return this.code === 'NET-01';
  }
}

export function toApiError(error) {
  if (error instanceof ApiError) return error;
  return new ApiError({
    code: 'NET-01',
    message: 'Nav savienojuma ar serveri.',
    cause: error,
  });
}
