import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Booking, Category, Event, EventCategory, User } from '../../db/models';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Event, Booking, Category, EventCategory]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
