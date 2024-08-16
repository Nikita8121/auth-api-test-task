export type ICommandResponse<T = null, S = boolean> = S extends true
  ? {
      isSuccess: S;
      data: T;
      code?: string;
      message?: string;
    }
  : {
      isSuccess: S;
      data?: never;
      code: string;
      message: string;
    };
