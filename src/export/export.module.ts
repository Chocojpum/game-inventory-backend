import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { GamesModule } from '../games/games.module';
import { BacklogModule } from '../backlog/backlog.module';
import { ConsolesModule } from '../consoles/consoles.module';
import { ConsoleFamiliesModule } from '../console-families/console-families.module';
import { PeripheralsModule } from '../peripherals/peripherals.module';
import { CategoriesModule } from '../categories/categories.module';
import { AttributesModule } from '../attributes/attributes.module';

@Module({
  imports: [
    GamesModule,
    BacklogModule,
    ConsolesModule,
    ConsoleFamiliesModule,
    PeripheralsModule,
    CategoriesModule,
    AttributesModule,
  ],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}