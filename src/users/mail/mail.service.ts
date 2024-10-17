import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmation(email: string, token: string) {
    const url = `http://localhost:8000/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Подтверждение регистрации',
      text: `Подтвердите свою регистрацию, перейдя по следующей ссылке: ${url}`,
    });
  }
}
