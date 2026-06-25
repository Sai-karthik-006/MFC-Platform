export type ApiResponseType<T = unknown> = {
  success: boolean;
  data: T;
  timestamp: string;
};

export type ApiErrorType = {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path?: string;
};
