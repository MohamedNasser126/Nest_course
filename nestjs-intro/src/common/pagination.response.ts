export interface PaginationResponses<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
