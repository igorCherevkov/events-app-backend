import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Category } from '../../db/models';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
