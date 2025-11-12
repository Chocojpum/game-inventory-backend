import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Game } from './entities/game.entity';
import { CreateGameDto, UpdateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
  private games: Game[] = [];

  create(createGameDto: CreateGameDto): Game {
    const game: Game = {
      id: uuidv4(),
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

  findOne(id: string): Game {
    const game = this.games.find(g => g.id === id);
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }

  search(query: string): Game[] {
    const lowerQuery = query.toLowerCase();
    return this.games.filter(game => {
      const titleMatch = game.title.toLowerCase().includes(lowerQuery);
      const altTitlesMatch = game.alternateTitles?.some(alt => 
        alt.toLowerCase().includes(lowerQuery)
      );
      return titleMatch || altTitlesMatch;
    });
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

  findByCategory(categoryId: string): Game[] {
    return this.games.filter(game => game.categoryIds.includes(categoryId));
  }
}