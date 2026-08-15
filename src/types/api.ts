export type ApiError = {
  field: string;
  message: string;
};

export type ApiResponse<T = unknown> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
  errors?: ApiError[];
  trace_id?: string;
};

export type PaginationMeta = {
  page: number;
  total_data: number;
  total_pages: number;
  total_per_page: number;
};

export type Paginated<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type PaginatedResponse<T> = ApiResponse<Paginated<T>>;

export type ActionState<T = unknown> = ApiResponse<T> | null;
