import { Injectable, NotFoundException } from '@nestjs/common';
import { Attribute } from './entities/attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AttributesService {
  private attributes: Attribute[] = [];

  create(createAttributeDto: CreateAttributeDto, customId?: string): Attribute {
    const attribute: Attribute = {
      id: customId || uuidv4(),
      ...createAttributeDto,
      isGlobal: createAttributeDto.isGlobal || false,
      createdAt: new Date(),
    };
    this.attributes.push(attribute);
    return attribute;
  }

  findAll(): Attribute[] {
    return this.attributes;
  }

  findGlobal(): Attribute[] {
    return this.attributes.filter(a => a.isGlobal);
  }

  findOne(id: string): Attribute {
    const attribute = this.attributes.find(a => a.id === id);
    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }
    return attribute;
  }

  remove(id: string): void {
    const attributeIndex = this.attributes.findIndex(a => a.id === id);
    if (attributeIndex === -1) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }
    this.attributes.splice(attributeIndex, 1);
  }
}