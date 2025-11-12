import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { CategoriesModule } from './categories/categories.module';
import { AttributesModule } from './attributes/attributes.module';

@Module({
  imports: [GamesModule, CategoriesModule, AttributesModule],
})
export class AppModule {}