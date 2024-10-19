import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../src/users/auth/guards/jwt-auth.guard';
import {
  RolesDecorator,
  RolesGuard,
} from '../../src/users/auth/guards/roles.guard';
import { Roles } from '../../src/types/users.types';
import { Category } from '../../db/models';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.admin)
  getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.admin)
  createCategory(@Body() categoryName: string): Promise<Category> {
    return this.categoriesService.createCategory(categoryName);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.admin)
  deleteCategory(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoriesService.deleteCategory(categoryId);
  }
}
