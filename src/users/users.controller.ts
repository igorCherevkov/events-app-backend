import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesDecorator, RolesGuard } from './auth/guards/roles.guard';
import { Roles } from 'src/types/users.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.admin)
  deleteUser(@Param('id', ParseIntPipe) userId: number): Promise<string> {
    return this.usersService.deleteUser(userId);
  }
}
