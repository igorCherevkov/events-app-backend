import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Category } from '../../db/models';

@Module({
  imports: [SequelizeModule.forFeature([Category])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
