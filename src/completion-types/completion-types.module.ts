import { Module } from '@nestjs/common';
import { CompletionTypesService } from './completion-types.service';
import { CompletionTypesController } from './completion-types.controller';

@Module({
  controllers: [CompletionTypesController],
  providers: [CompletionTypesService],
  exports: [CompletionTypesService],
})
export class CompletionTypesModule {}