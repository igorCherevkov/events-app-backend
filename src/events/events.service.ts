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

  async getAllEvents(): Promise<Event[]> {
    return this.eventsModel.findAll({
      where: { publication: true },
      attributes: { exclude: ['createdAt', 'updatedAt', 'publication'] },
      include: [{ model: Category, attributes: { include: ['id', 'name'] } }],
    });
  }

  async createEvent(name: string, description: string): Promise<Event> {
    return this.eventsModel.create({ name, description });
  }

  async signUpForEvent(userId: number, eventId: number): Promise<Event> {
    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('user not found');

    const event = this.eventsModel.findByPk(eventId);
    if (!event) throw new NotFoundException('event not found');

    const existingBooking = await this.bookingModel.findOne({
      where: { userId, eventId },
    });
    if (existingBooking) throw new Error('already signed up for this event');

    await this.bookingModel.create({ userId, eventId });

    return this.eventsModel.findOne({
      where: { id: eventId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'publication'] },
      include: [{ model: Category, attributes: { include: ['id', 'name'] } }],
    });
  }

  async getEventsForUser(userId: number): Promise<Event[]> {
    const user = await this.userModel.findOne({ where: { id: userId } });
    const isAdmin = user.role === Roles.admin;

    const bookings = await this.bookingModel.findAll({ where: { userId } });

    const eventsIds = bookings.map((booking) => booking.eventId);

    return this.eventsModel.findAll({
      where: isAdmin ? {} : { id: eventsIds },
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

  async changeEventInfo(
    eventId: number,
    name: string,
    description: string,
    publication: boolean,
  ): Promise<Event> {
    const event = await this.eventsModel.findByPk(eventId);

    if (!event) throw new NotFoundException('event not found');

    if (name) event.name = name;
    if (description) event.description = description;
    if (publication) event.publication = publication;

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
