export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export interface ApiErrorBody {
  status: "error";
  message: string;
  errors?: unknown;
}
