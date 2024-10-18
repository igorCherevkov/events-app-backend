import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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

  @Get(':userId')
  getAllEvents(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Event[]> {
    return this.eventsService.getAllEvents(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  signUpForEvent(
    @Body() body: { userId: number; eventId: number },
  ): Promise<Booking> {
    return this.eventsService.signUpForEvent(body.userId, body.eventId);
  }

  @Get(':id')
  //   @UseGuards(JwtAuthGuard)
  getEventsForUser(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Event[]> {
    return this.eventsService.getEventsForUser(userId);
  }

  @Delete(':id/:eventId')
  //   @UseGuards(JwtAuthGuard)
  unsubscribeFromEvent(
    @Param('id', ParseIntPipe) userId: number,
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<string> {
    return this.eventsService.unsubscribeFromEvent(userId, eventId);
  }

  @Patch(':id')
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @RolesDecorator(Roles.admin)
  changeEvent(
    @Param('id', ParseIntPipe) eventId: number,
    @Body() body: { publication?: boolean; categoryIds?: number[] },
  ): Promise<Event> {
    if (typeof body.publication !== 'undefined')
      return this.eventsService.changeEventStatus(eventId, body.publication);

    if (body.categoryIds) {
      return this.eventsService.updateEventCategories(
        eventId,
        body.categoryIds,
      );
    }

    throw new NotFoundException('body not found');
  }

  @Delete(':id')
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @RolesDecorator(Roles.admin)
  deleteEvent(@Param('id', ParseIntPipe) eventId: number): Promise<string> {
    return this.eventsService.deleteEvent(eventId);
  }
}
