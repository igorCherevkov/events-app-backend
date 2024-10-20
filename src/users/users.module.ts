import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersService } from './users.service';
import { AuthModule } from './auth/auth.module';
import { User } from '../../db/models';
import { UsersController } from './users.controller';

@Module({
  imports: [forwardRef(() => AuthModule), SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
