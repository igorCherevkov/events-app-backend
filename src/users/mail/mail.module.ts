import { Module } from '@nestjs/common';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
