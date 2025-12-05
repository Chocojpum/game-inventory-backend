export interface GamesQueryDto {
  page?: string;
  limit?: string;
  search?: string;
  consoleFamilyId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  // Use a catch-all for potential multiple category IDs if you are sending them as unique keys (e.g., categoryId_0)
  [key: string]: string | undefined;
}