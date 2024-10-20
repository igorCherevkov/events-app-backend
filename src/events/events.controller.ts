import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { Event } from '../../db/models';
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

  @Get('search')
  searchEvents(
    @Request() req,
    @Query('query') query: string,
  ): Promise<Event[]> {
    let userId = null;
    if (req.user) {
      userId = req.user.id;
    }
    return this.eventsService.searchEvents(query, userId);
  }

  @Post('create-event')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.admin)
  createEvent(
    @Body() body: { name: string; description: string; date: string },
  ): Promise<Event> {
    return this.eventsService.createEvent(
      body.name,
      body.description,
      body.date,
    );
  }

  @Post('sign-to-event')
  @UseGuards(JwtAuthGuard)
  signUpForEvent(
    @Body() body: { userId: number; eventId: number },
  ): Promise<Event> {
    return this.eventsService.signUpForEvent(body.userId, body.eventId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getEventsForUser(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Event[]> {
    return this.eventsService.getEventsForUser(userId);
  }

  @Delete(':id/:eventId')
  @UseGuards(JwtAuthGuard)
  unsubscribeFromEvent(
    @Param('id', ParseIntPipe) userId: number,
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<string> {
    return this.eventsService.unsubscribeFromEvent(userId, eventId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.admin)
  changeEvent(
    @Param('id', ParseIntPipe) eventId: number,
    @Body()
    body: {
      name?: string;
      description?: string;
      publication?: boolean;
      date?: string;
      categoryNames?: string[];
    },
  ): Promise<Event> {
    if (
      typeof body.publication !== 'undefined' ||
      body.name ||
      body.description ||
      body.date ||
      body.categoryNames
    )
      return this.eventsService.changeEventInfo(
        eventId,
        body.name,
        body.description,
        body.date,
        body.publication,
        body.categoryNames,
      );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.admin)
  deleteEvent(@Param('id', ParseIntPipe) eventId: number): Promise<string> {
    return this.eventsService.deleteEvent(eventId);
  }
}
