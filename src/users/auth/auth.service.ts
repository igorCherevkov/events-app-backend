import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users.service';
import { RequestingData, ReturningData, Roles } from '../../types/users.types';
import { User } from '../../../db/models';
import { registrationDto } from './dto/registration.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async registration(user: registrationDto): Promise<ReturningData> {
    const checkLogin = await this.userModel.findOne({
      where: { email: user.email },
    });

    if (checkLogin) throw new Error('email already exists');

    const hashPassword = await bcrypt.hash(user.password, 5);
    const newUser = await this.userModel.create({
      email: user.email,
      password: hashPassword,
      role: Roles.user,
      confirmation: false,
    });

    const token = await this.generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      confirmation: newUser.confirmation,
    });

    await this.mailService.sendConfirmation(newUser.email, token.token);

    return {
      ...token,
    };
  }

  async confirmEmail(token: string): Promise<string> {
    try {
      const decodedUser = this.jwtService.verify(token);

      const user = await this.userModel.findOne({
        where: { id: decodedUser.id },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      });

      if (!user) throw new NotFoundException('user not found');

      user.confirmation = true;
      await user.save();

      return 'success';
    } catch (error) {
      throw new BadRequestException('invalid or expired token');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const checkUser = await this.usersService.findUser(email);

    const passwordsIsMatch = await bcrypt.compare(password, checkUser.password);

    if (checkUser && passwordsIsMatch) {
      return checkUser;
    }

    throw new BadRequestException('email or password are incorrect');
  }

  async profile(user: User): Promise<User> {
    return this.userModel.findOne({
      where: { id: user.id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
    });
  }

  async generateToken(user: RequestingData): Promise<ReturningData> {
    const { id, email, confirmation, role } = user;

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      id,
      email,
      role,
      confirmation,
      token,
    };
  }
}
