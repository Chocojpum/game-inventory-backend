import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ConsoleFamiliesService } from './console-families.service';
import { CreateConsoleFamilyDto } from './dto/create-console-family.dto';

@Controller('console-families')
export class ConsoleFamiliesController {
  constructor(private readonly service: ConsoleFamiliesService) {}

  @Post()
  create(@Body() dto: CreateConsoleFamilyDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.service.search(search);
    }
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}