import { Injectable, NotFoundException } from '@nestjs/common';
import { ConsoleFamily } from './entities/console-family.entity';
import { CreateConsoleFamilyDto } from './dto/create-console-family.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConsoleFamiliesService {
  private consoleFamilies: ConsoleFamily[] = [];

  create(dto: CreateConsoleFamilyDto, customId?: string): ConsoleFamily {
    const family: ConsoleFamily = {
      id: customId || uuidv4(),
      ...dto,
      createdAt: new Date(),
    };
    this.consoleFamilies.push(family);
    return family;
  }

  findAll(): ConsoleFamily[] {
    return this.consoleFamilies;
  }

  findOne(id: string): ConsoleFamily {
    const family = this.consoleFamilies.find(f => f.id === id);
    if (!family) {
      throw new NotFoundException(`Console family with ID ${id} not found`);
    }
    return family;
  }

  search(query: string): ConsoleFamily[] {
    const lowerQuery = query.toLowerCase();
    return this.consoleFamilies.filter(family => 
      family.name.toLowerCase().includes(lowerQuery)
    );
  }

  remove(id: string): void {
    const index = this.consoleFamilies.findIndex(f => f.id === id);
    if (index === -1) {
      throw new NotFoundException(`Console family with ID ${id} not found`);
    }
    this.consoleFamilies.splice(index, 1);
  }
}