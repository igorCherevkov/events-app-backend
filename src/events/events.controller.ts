import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { Booking, Event } from '../../db/models';
import { JwtAuthGuard } from 'src/users/auth/guards/jwt-auth.guard';
import { RolesDecorator, RolesGuard } from 'src/users/auth/guards/roles.guard';
import { Roles } from 'src/types/users.types';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAllEvents(): Promise<Event[]> {
    return this.eventsService.getAllEvents();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  signUpForEvent(
    @Body() body: { userId: number; eventId: number },
  ): Promise<Booking> {
    return this.eventsService.signUpForEvent(body.userId, body.eventId);
  }

  @Get(':id')
  getEventsForUser(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Event[]> {
    return this.eventsService.getEventsForUser(userId);
  }

  @Delete(':id/:eventId')
  unsubscribeFromEvent(
    @Param('id', ParseIntPipe) userId: number,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    return this.eventsService.unsubscribeFromEvent(userId, eventId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.admin)
  changeEvent(@Param('id', ParseIntPipe) eventId: number) {
    return this.eventsService.changeEvent();
  }
}
