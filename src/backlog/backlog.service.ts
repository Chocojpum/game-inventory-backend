import { Injectable, NotFoundException } from '@nestjs/common';
import { Backlog } from './entities/backlog.entity';
import { CreateBacklogDto, UpdateBacklogDto } from './dto/create-backlog.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BacklogService {
  private backlogs: Backlog[] = [];

  create(createBacklogDto: CreateBacklogDto): Backlog {
    const backlog: Backlog = {
      id: uuidv4(),
      ...createBacklogDto,
      customAttributes: createBacklogDto.customAttributes || {},
      createdAt: new Date(),
    };
    this.backlogs.push(backlog);
    return backlog;
  }

  findAll(): Backlog[] {
    return this.backlogs;
  }

  findByGame(gameId: string): Backlog[] {
    return this.backlogs.filter(b => b.gameId === gameId);
  }

  findOne(id: string): Backlog {
    const backlog = this.backlogs.find(b => b.id === id);
    if (!backlog) {
      throw new NotFoundException(`Backlog entry with ID ${id} not found`);
    }
    return backlog;
  }

  update(id: string, updateBacklogDto: UpdateBacklogDto): Backlog {
    const backlogIndex = this.backlogs.findIndex(b => b.id === id);
    if (backlogIndex === -1) {
      throw new NotFoundException(`Backlog entry with ID ${id} not found`);
    }
    this.backlogs[backlogIndex] = {
      ...this.backlogs[backlogIndex],
      ...updateBacklogDto,
    };
    return this.backlogs[backlogIndex];
  }

  remove(id: string): void {
    const backlogIndex = this.backlogs.findIndex(b => b.id === id);
    if (backlogIndex === -1) {
      throw new NotFoundException(`Backlog entry with ID ${id} not found`);
    }
    this.backlogs.splice(backlogIndex, 1);
  }
}