import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { EventsService } from './events.service';
import { Event } from '../../db/models';
import { JwtAuthGuard } from 'src/users/auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAllEvents(): Promise<Event[]> {
    return this.eventsService.getAllEvents();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  signUpForEvent() {
    return this.eventsService.signUpForEvent();
  }
}
