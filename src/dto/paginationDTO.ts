export interface PageInfo {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pageInfo: PageInfo;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
