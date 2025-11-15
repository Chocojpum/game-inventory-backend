import { Module } from '@nestjs/common';
import { ConsoleFamiliesService } from './console-families.service';
import { ConsoleFamiliesController } from './console-families.controller';

@Module({
  controllers: [ConsoleFamiliesController],
  providers: [ConsoleFamiliesService],
  exports: [ConsoleFamiliesService],
})
export class ConsoleFamiliesModule {}