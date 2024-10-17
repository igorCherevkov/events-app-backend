import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ConfirmedGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const confirmationUser = await this.usersService.findUser(user.email);

    if (!user || !confirmationUser || !confirmationUser.confirmation) {
      throw new ForbiddenException('email not confirmed');
    }

    return true;
  }
}
