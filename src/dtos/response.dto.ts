export type ApiSuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

export function successResponse<T>(data: T, message?: string): ApiSuccessResponse<T> {
  const payload: ApiSuccessResponse<T> = { success: true, data };
  if (message) {
    payload.message = message;
  }
  return payload;
}
