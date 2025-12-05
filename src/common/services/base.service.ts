import { PaginatedResult, PaginationOptions } from "../interfaces/pagination.interface";

export abstract class BaseService {
  /**
   * Applies pagination to a standard array of items.
   * * @param items The full array of items (Game[], User[], etc.).
   * @param options The pagination parameters (page and limit).
   * @returns A standard PaginatedResult object.
   */
  protected paginate<T>(items: T[], options: PaginationOptions): PaginatedResult<T> {
    const defaultLimit = 10;
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : defaultLimit;

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(total / limit);

    const data = items.slice(startIndex, endIndex);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}