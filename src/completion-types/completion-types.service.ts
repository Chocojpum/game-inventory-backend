import { Injectable, NotFoundException } from '@nestjs/common';
import { CompletionType } from './entities/completion-type.entity';
import { CreateCompletionTypeDto } from './dto/create-completion-type.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CompletionTypesService {
  private completionTypes: CompletionType[] = [
    { id: uuidv4(), name: 'Casual', createdAt: new Date() },
    { id: uuidv4(), name: 'Platinum Trophy', createdAt: new Date() },
    { id: uuidv4(), name: '100%', createdAt: new Date() },
    { id: uuidv4(), name: 'Story Only', createdAt: new Date() },
  ];

  create(createCompletionTypeDto: CreateCompletionTypeDto): CompletionType {
    const completionType: CompletionType = {
      id: uuidv4(),
      ...createCompletionTypeDto,
      createdAt: new Date(),
    };
    this.completionTypes.push(completionType);
    return completionType;
  }

  findAll(): CompletionType[] {
    return this.completionTypes;
  }

  findOne(id: string): CompletionType {
    const completionType = this.completionTypes.find(ct => ct.id === id);
    if (!completionType) {
      throw new NotFoundException(`Completion type with ID ${id} not found`);
    }
    return completionType;
  }

  remove(id: string): void {
    const ctIndex = this.completionTypes.findIndex(ct => ct.id === id);
    if (ctIndex === -1) {
      throw new NotFoundException(`Completion type with ID ${id} not found`);
    }
    this.completionTypes.splice(ctIndex, 1);
  }
}