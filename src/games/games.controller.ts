import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';
import { PaginationOptions } from 'src/common/interfaces/pagination.interface';
import { GamesQueryDto } from './dto/games.query.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  fetchGames(@Query() query: GamesQueryDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const filters = {
        query: query.query,
        consoleFamilyId: query.consoleFamilyId,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        // Collect category IDs from the generic keys (categoryId_0, categoryId_1, etc.)
        categoryIds: Object.keys(query)
            .filter(key => key.startsWith('categoryId_'))
            .map(key => query[key]) as string[], // Type assertion to string array
        sortBy: query.sortBy 
    };
    return this.gamesService.getFilteredAndPaginatedGames(filters, { page, limit });
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string, options?: PaginationOptions) {
    return this.gamesService.findByCategory(categoryId, options);
  }

  @Get('console/:consoleId')
  findByConsole(@Param('consoleId') consoleId: string, options?: PaginationOptions) {
    return this.gamesService.findByConsole(consoleId, options);
  }

  @Get('console-family/:familyId')
  findByConsoleFamily(@Param('familyId') familyId: string, options?: PaginationOptions) {
    return this.gamesService.findByConsoleFamily(familyId, options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}