import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersService } from './users.service';
import { AuthModule } from './auth/auth.module';
import { User } from '../../db/models';

@Module({
  imports: [forwardRef(() => AuthModule), SequelizeModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
