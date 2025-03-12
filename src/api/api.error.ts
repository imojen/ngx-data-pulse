export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiErrorHandler {
  static handle(error: unknown): Promise<never> {
    if (error instanceof ApiError) {
      return Promise.reject(error);
    }

    if (error instanceof Error) {
      return Promise.reject(new ApiError(500, error.message));
    }

    return Promise.reject(
      new ApiError(500, "Une erreur inconnue est survenue")
    );
  }
}
