export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort?: string;
}

export interface PageQuery {
  page: number;
  size: number;
  q?: string;
  sort?: string;
}
