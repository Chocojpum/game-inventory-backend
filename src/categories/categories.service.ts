import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [];

  create(createCategoryDto: CreateCategoryDto, customId?: string): Category {
    const category: Category = {
      id: customId || uuidv4(),
      ...createCategoryDto,
      createdAt: new Date(),
    };
    this.categories.push(category);
    return category;
  }

  findAll(): Category[] {
    return this.categories;
  }

  findOne(id: string): Category {
    const category = this.categories.find(c => c.id === id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  findByType(type: string): Category[] {
    return this.categories.filter(c => c.type === type);
  }

  search(query: string, type?: string): Category[] {
    const lowerQuery = query.toLowerCase();
    let filtered = this.categories.filter(category => 
      category.name.toLowerCase().includes(lowerQuery)
    );
    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }
    return filtered;
  }

  remove(id: string): void {
    const categoryIndex = this.categories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    this.categories.splice(categoryIndex, 1);
  }
}