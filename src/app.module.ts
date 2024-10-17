import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { Booking, Category, Event, EventCategory, User } from '../db/models';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    UsersModule,
    EventsModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        dialect: configService.get('DB_DIALECT'),
        models: [User, Event, Category, EventCategory, Booking],
      }),
    }),
  ],
})
export class AppModule {}
