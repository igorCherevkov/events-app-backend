import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'db/models';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findUser(email: string): Promise<User> {
    return await this.userModel.findOne({ where: { email } });
  }
}
