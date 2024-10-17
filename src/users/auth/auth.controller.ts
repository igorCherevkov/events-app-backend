import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { registrationDto } from './dto/registration.dto';
import { ReturningData } from '../../types/users.types';
import { User } from '../../../db/models';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  registration(@Body() user: registrationDto): Promise<ReturningData> {
    return this.authService.registration(user);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req): Promise<ReturningData> {
    return this.authService.generateToken(req.user);
  }

  @Get('confirm')
  @UseGuards(JwtAuthGuard)
  confirmEmail(@Query('token') token: string): Promise<string> {
    return this.authService.confirmEmail(token);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Request() req): Promise<User> {
    return this.authService.profile(req.user);
  }
}
