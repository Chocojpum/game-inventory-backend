import { Injectable, NotFoundException } from '@nestjs/common';
import { Peripheral } from './entities/peripheral.entity';
import { CreatePeripheralDto, UpdatePeripheralDto } from './dto/create-peripheral.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PeripheralsService {
  private peripherals: Peripheral[] = [];

  create(createPeripheralDto: CreatePeripheralDto): Peripheral {
    const peripheral: Peripheral = {
      id: uuidv4(),
      ...createPeripheralDto,
      quantity: createPeripheralDto.quantity || 1,
      customAttributes: createPeripheralDto.customAttributes || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.peripherals.push(peripheral);
    return peripheral;
  }

  findAll(): Peripheral[] {
    return this.peripherals;
  }

  findOne(id: string): Peripheral {
    const peripheral = this.peripherals.find(p => p.id === id);
    if (!peripheral) {
      throw new NotFoundException(`Peripheral with ID ${id} not found`);
    }
    return peripheral;
  }

  findByConsole(consoleId: string): Peripheral[] {
    return this.peripherals.filter(p => p.consoleFamilyId === consoleId);
  }

  search(query: string): Peripheral[] {
    const lowerQuery = query.toLowerCase();
    return this.peripherals.filter(peripheral => 
      peripheral.name.toLowerCase().includes(lowerQuery)
    );
  }

  update(id: string, updatePeripheralDto: UpdatePeripheralDto): Peripheral {
    const peripheralIndex = this.peripherals.findIndex(p => p.id === id);
    if (peripheralIndex === -1) {
      throw new NotFoundException(`Peripheral with ID ${id} not found`);
    }
    this.peripherals[peripheralIndex] = {
      ...this.peripherals[peripheralIndex],
      ...updatePeripheralDto,
      updatedAt: new Date(),
    };
    return this.peripherals[peripheralIndex];
  }

  remove(id: string): void {
    const peripheralIndex = this.peripherals.findIndex(p => p.id === id);
    if (peripheralIndex === -1) {
      throw new NotFoundException(`Peripheral with ID ${id} not found`);
    }
    this.peripherals.splice(peripheralIndex, 1);
  }
}