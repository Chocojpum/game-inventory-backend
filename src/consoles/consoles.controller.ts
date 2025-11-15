import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ConsolesService } from './consoles.service';
import { CreateConsoleDto, UpdateConsoleDto } from './dto/create-console.dto';

@Controller('consoles')
export class ConsolesController {
  constructor(private readonly consolesService: ConsolesService) {}

  @Post()
  create(@Body() createConsoleDto: CreateConsoleDto) {
    return this.consolesService.create(createConsoleDto);
  }

  @Get()
  findAll(@Query('search') search?: string, @Query('familyId') familyId?: string) {
    if (search) {
      return this.consolesService.search(search);
    }
    if (familyId) {
      return this.consolesService.findByFamily(familyId);
    }
    return this.consolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsoleDto: UpdateConsoleDto) {
    return this.consolesService.update(id, updateConsoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consolesService.remove(id);
  }
}
