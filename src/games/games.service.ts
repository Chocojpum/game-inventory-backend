import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from 'src/common/services/base.service';
import { PaginatedResult, PaginationOptions } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class GamesService extends BaseService{
  private games: Game[] = [];

  create(createGameDto: CreateGameDto, customId?: string): Game {
    const game: Game = {
      id: customId || uuidv4(),
      ...createGameDto,
      customAttributes: createGameDto.customAttributes || {},
      categoryIds: createGameDto.categoryIds || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.games.push(game);
    return game;
  }

  findAll(): Game[] {
    return this.games;
  }

  private sortGames(games: Game[], sortBy: string): Game[] {
    const sorted = [...games];

    switch (sortBy) {
      case 'title-asc':
        // Sort by title alphabetically ascending
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        // Sort by title alphabetically descending
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'date-asc':
        // Sort by release date ascending (oldest first)
        return sorted.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
      case 'date-desc':
        // Sort by release date descending (newest first)
        return sorted.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
      default:
        // Default to title ascending if sort criteria is not recognized
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  /**
   * Unifies filtering, searching, and pagination logic into one method.
   * In a production environment, this would build a complex database query.
   */
  async getFilteredAndPaginatedGames(
    filters,
    options: PaginationOptions,
  ): Promise<PaginatedResult<Game>> {
    
    // 1. Start with the full data set
    var filteredGames = this.findAll();
    filteredGames = filteredGames.sort()

    // 2. Apply Search Filter
    if (filters.query) {
      const searchTerm = filters.query.toLowerCase().trim();
      filteredGames = filteredGames.filter(game => 
        game.title.toLowerCase().includes(searchTerm)
      );
    }
    
    // 3. Apply Console Family Filter
    if (filters.consoleFamilyId) {
      filteredGames = filteredGames.filter(game => 
        game.consoleFamilyId === filters.consoleFamilyId
      );
    }
    
    // 4. Apply Category (Multi-tag) Filters
    // This assumes a logical AND: the game must have ALL selected category IDs.
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filteredGames = filteredGames.filter(game => 
        filters.categoryIds.every(filterId => game.categoryIds.includes(filterId))
      );
    }

    // 5. Apply Date Range Filter
    try {
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        // Set time to start of day for accurate comparison
        fromDate.setUTCHours(0, 0, 0, 0); 
        filteredGames = filteredGames.filter(game => new Date(game.releaseDate) >= fromDate);
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        // Set time to end of day for accurate comparison
        toDate.setUTCHours(23, 59, 59, 999);
        filteredGames = filteredGames.filter(game => new Date(game.releaseDate) <= toDate);
      }
    } catch (e) {
      console.error('Invalid date format in filters:', e);
      throw new InternalServerErrorException('Invalid date format provided.');
    }

    // 6. Sorts with the sortBy indication in format field-direction

    if (filters.sortBy) {
      filteredGames = this.sortGames(filteredGames, filters.sortBy);
    }
    
    // 7. Calculate Pagination Metadata
    const total = filteredGames.length;
    const limit = options.limit > 0 ? options.limit : 10;
    const totalPages = Math.ceil(total / limit);
    const page = options.page > 0 && options.page <= totalPages ? options.page : 1;

    // 8. Apply Pagination Slice (simulating 'skip' and 'take' in a database query)
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = filteredGames.slice(startIndex, endIndex);

    // 9. Return the structured result
    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  }

  findOne(id: string): Game {
    const game = this.games.find(g => g.id === id);
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }

  search(query: string, options: PaginationOptions = {}): PaginatedResult<Game> {
    const lowerQuery = query.toLowerCase();
    const filteredGames = this.games.filter(game => {
      const titleMatch = game.title.toLowerCase().includes(lowerQuery);
      const altTitlesMatch = game.alternateTitles?.some(alt => 
        alt.toLowerCase().includes(lowerQuery)
      );
      return titleMatch || altTitlesMatch;
    });

    return this.paginate(filteredGames, options);
  }

  update(id: string, updateGameDto: UpdateGameDto): Game {
    const gameIndex = this.games.findIndex(g => g.id === id);
    if (gameIndex === -1) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    this.games[gameIndex] = {
      ...this.games[gameIndex],
      ...updateGameDto,
      updatedAt: new Date(),
    };
    return this.games[gameIndex];
  }

  remove(id: string): void {
    const gameIndex = this.games.findIndex(g => g.id === id);
    if (gameIndex === -1) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    this.games.splice(gameIndex, 1);
  }

  findByCategory(categoryId: string, options: PaginationOptions = {}): PaginatedResult<Game> {
    const filteredGames = this.games.filter(game => game.categoryIds.includes(categoryId));
    return this.paginate(filteredGames, options);
  }

  findByConsole(consoleId: string, options: PaginationOptions = {}): PaginatedResult<Game> {
    const filteredGames = this.games.filter(game => game.consoleId === consoleId);
    return this.paginate(filteredGames, options)
  }

  findByConsoleFamily(consoleFamilyId: string, options: PaginationOptions = {}): PaginatedResult<Game> {
    const filteredGames = this.games.filter(game => game.consoleFamilyId === consoleFamilyId);
    return this.paginate(filteredGames, options)
  }
}