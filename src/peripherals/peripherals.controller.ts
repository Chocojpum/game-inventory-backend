import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PeripheralsService } from './peripherals.service';
import { CreatePeripheralDto, UpdatePeripheralDto } from './dto/create-peripheral.dto';

@Controller('peripherals')
export class PeripheralsController {
  constructor(private readonly peripheralsService: PeripheralsService) {}

  @Post()
  create(@Body() createPeripheralDto: CreatePeripheralDto) {
    return this.peripheralsService.create(createPeripheralDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.peripheralsService.search(search);
    }
    return this.peripheralsService.findAll();
  }

  @Get('console/:consoleId')
  findByConsole(@Param('consoleId') consoleId: string) {
    return this.peripheralsService.findByConsole(consoleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peripheralsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeripheralDto: UpdatePeripheralDto) {
    return this.peripheralsService.update(id, updatePeripheralDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.peripheralsService.remove(id);
  }
}