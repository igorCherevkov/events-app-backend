import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Category, Event } from '../../db/models';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event) private eventsModel: typeof Event) {}

  async getAllEvents(): Promise<Event[]> {
    return this.eventsModel.findAll({
      where: { publication: true },
      attributes: { exclude: ['createdAt', 'updatedAt', 'publication'] },
      include: [{ model: Category, attributes: { include: ['id', 'name'] } }],
    });
  }

  async signUpForEvent();
}
