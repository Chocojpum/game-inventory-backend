import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CompletionTypesService } from './completion-types.service';
import { CreateCompletionTypeDto } from './dto/create-completion-type.dto';

@Controller('completion-types')
export class CompletionTypesController {
  constructor(private readonly completionTypesService: CompletionTypesService) {}

  @Post()
  create(@Body() createCompletionTypeDto: CreateCompletionTypeDto) {
    return this.completionTypesService.create(createCompletionTypeDto);
  }

  @Get()
  findAll() {
    return this.completionTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.completionTypesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.completionTypesService.remove(id);
  }
}