import { Injectable, NotFoundException } from '@nestjs/common';
import { Console } from './entities/console.entity';
import { CreateConsoleDto, UpdateConsoleDto } from './dto/create-console.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConsolesService {
  private consoles: Console[] = [];

  create(createConsoleDto: CreateConsoleDto, customId?: string): Console {
    const console: Console = {
      id: customId || uuidv4(),
      ...createConsoleDto,
      customAttributes: createConsoleDto.customAttributes || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.consoles.push(console);
    return console;
  }

  findAll(): Console[] {
    return this.consoles;
  }

  findOne(id: string): Console {
    const console = this.consoles.find(c => c.id === id);
    if (!console) {
      throw new NotFoundException(`Console with ID ${id} not found`);
    }
    return console;
  }

  search(query: string): Console[] {
    const lowerQuery = query.toLowerCase();
    return this.consoles.filter(console => 
      console.model.toLowerCase().includes(lowerQuery) ||
      console.region.toLowerCase().includes(lowerQuery)
    );
  }

  findByFamily(consoleFamilyId: string): Console[] {
    return this.consoles.filter(c => c.consoleFamilyId === consoleFamilyId);
  }

  update(id: string, updateConsoleDto: UpdateConsoleDto): Console {
    const consoleIndex = this.consoles.findIndex(c => c.id === id);
    if (consoleIndex === -1) {
      throw new NotFoundException(`Console with ID ${id} not found`);
    }
    this.consoles[consoleIndex] = {
      ...this.consoles[consoleIndex],
      ...updateConsoleDto,
      updatedAt: new Date(),
    };
    return this.consoles[consoleIndex];
  }

  remove(id: string): void {
    const consoleIndex = this.consoles.findIndex(c => c.id === id);
    if (consoleIndex === -1) {
      throw new NotFoundException(`Console with ID ${id} not found`);
    }
    this.consoles.splice(consoleIndex, 1);
  }
}