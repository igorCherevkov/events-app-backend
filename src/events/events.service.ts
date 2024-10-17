import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Booking, Category, Event, User } from '../../db/models';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event) private eventsModel: typeof Event,
    @InjectModel(Booking) private bookingModel: typeof Booking,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async getAllEvents(): Promise<Event[]> {
    return this.eventsModel.findAll({
      where: { publication: true },
      attributes: { exclude: ['createdAt', 'updatedAt', 'publication'] },
      include: [{ model: Category, attributes: { include: ['id', 'name'] } }],
    });
  }

  async signUpForEvent(userId: number, eventId: number): Promise<Booking> {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('user not found');

    const event = this.eventsModel.findByPk(eventId);
    if (!event) throw new NotFoundException('event not found');

    return this.bookingModel.create({ userId, eventId });
  }

  async getEventsForUser(userId: number): Promise<Event[]> {
    const bookings = await this.bookingModel.findAll({ where: { userId } });

    const eventsIds = bookings.map((booking) => booking.eventId);

    return this.eventsModel.findAll({
      where: { id: eventsIds },
      attributes: { exclude: ['createdAt', 'updatedAt', 'publication'] },
      include: [{ model: Category, attributes: { include: ['id', 'name'] } }],
    });
  }

  async unsubscribeFromEvent(userId: number, eventId: number) {
    const booking = await this.bookingModel.findOne({
      where: { userId, eventId },
    });

    if (!booking) throw new NotFoundException('booking not found');

    await booking.destroy();
  }

  async changeEvent() {
    return;
  }
}
