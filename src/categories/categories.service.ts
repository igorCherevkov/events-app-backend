import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Category } from '../../db/models';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryModel.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }

  async createCategory(categoryName: string): Promise<Category> {
    return this.categoryModel.create({ name: categoryName });
  }

  async deleteCategory(categoryId: number) {
    const category = await this.categoryModel.findOne({
      where: { id: categoryId },
    });

    if (!category) throw new NotFoundException('category not found');

    await category.destroy();

    return 'category deleted';
  }
}
