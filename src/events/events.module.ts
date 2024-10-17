import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Booking, Event, User } from '../../db/models';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Event, Booking])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
