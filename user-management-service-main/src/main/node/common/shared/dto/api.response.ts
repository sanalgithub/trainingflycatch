export class ApiResponse<T = any> {
  constructor(
    readonly timeStamp?: Date,
    readonly code?: number,
    readonly status?: boolean,
    readonly message?: string,
    readonly data?: T[],
  ) {}

  static create<E = any>(
    req: Partial<Omit<ApiResponse<E>, 'timeStamp'>>,
  ): ApiResponse<E> {
    return new ApiResponse<E>(
      new Date(),
      req.code,
      req.status,
      req.message,
      req.data,
    );
  }
}
