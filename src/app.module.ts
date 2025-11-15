import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { BacklogModule } from './backlog/backlog.module';
import { ConsolesModule } from './consoles/consoles.module';
import { ConsoleFamiliesModule } from './console-families/console-families.module';
import { PeripheralsModule } from './peripherals/peripherals.module';
import { CompletionTypesModule } from './completion-types/completion-types.module';
import { CategoriesModule } from './categories/categories.module';
import { AttributesModule } from './attributes/attributes.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    GamesModule,
    BacklogModule,
    ConsolesModule,
    ConsoleFamiliesModule,
    PeripheralsModule,
    CompletionTypesModule,
    CategoriesModule,
    AttributesModule,
    ExportModule,
  ],
})
export class AppModule {}