import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Booking, Category, Event, EventCategory, User } from '../../db/models';
import { Roles } from '../../src/types/users.types';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event) private eventsModel: typeof Event,
    @InjectModel(Booking) private bookingModel: typeof Booking,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Category) private categoryModel: typeof Category,
    @InjectModel(EventCategory)
    private eventCategoryModel: typeof EventCategory,
  ) {}

  async getAllEvents(userId: number): Promise<Event[]> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAdmin = user.role === Roles.admin;

    return this.eventsModel.findAll({
      where: isAdmin ? {} : { publication: true },
      attributes: { exclude: ['createdAt', 'updatedAt', 'publication'] },
      include: [{ model: Category, attributes: { include: ['id', 'name'] } }],
    });
  }

  async signUpForEvent(userId: number, eventId: number): Promise<Booking> {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('user not found');

    const event = this.eventsModel.findByPk(eventId);
    if (!event) throw new NotFoundException('event not found');

    const existingBooking = await this.bookingModel.findOne({
      where: { userId, eventId },
    });
    if (existingBooking) throw new Error('already signed up for this event');

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

  async unsubscribeFromEvent(userId: number, eventId: number): Promise<string> {
    const booking = await this.bookingModel.findOne({
      where: { userId, eventId },
    });

    if (!booking) throw new NotFoundException('booking not found');

    await booking.destroy();

    return 'booking deleted';
  }

  async changeEventStatus(
    eventId: number,
    publication: boolean,
  ): Promise<Event> {
    const event = await this.eventsModel.findByPk(eventId);

    if (!event) throw new NotFoundException('event not found');

    event.publication = publication;
    await event.save();

    return event;
  }

  async updateEventCategories(
    eventId: number,
    categoryIds: number[],
  ): Promise<Event> {
    const event = await this.eventsModel.findByPk(eventId);

    if (!event) throw new NotFoundException('event not found');

    await this.eventCategoryModel.destroy({ where: { eventId } });

    const categories = await this.categoryModel.findAll({
      where: { id: categoryIds },
    });

    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('categories not found');
    }

    for (const categoryId of categoryIds) {
      await this.eventCategoryModel.create({ eventId, categoryId });
    }

    return event;
  }

  async deleteEvent(eventId: number): Promise<string> {
    const event = await this.eventsModel.findByPk(eventId);

    if (!event) throw new NotFoundException('event not found');

    await event.destroy();

    return 'event deleted';
  }
}
