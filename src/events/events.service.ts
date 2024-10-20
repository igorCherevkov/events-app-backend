import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Booking, Category, Event, EventCategory, User } from '../../db/models';
import { Roles } from '../../src/types/users.types';
import { Op } from 'sequelize';

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

  async searchEvents(query: string, userId: number | null): Promise<Event[]> {
    let user = null;
    if (userId) user = await this.userModel.findByPk(userId);
    if (!user && !(user == null)) throw new NotFoundException('user not found');

    const isAdmin = user && user.role === Roles.admin;

    return this.eventsModel.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
        ...(isAdmin ? {} : { publication: true }),
      },
      attributes: { exclude: ['createdAt', 'updatedAt', 'publication'] },
      include: [{ model: Category, attributes: ['id', 'name'] }],
    });
  }

  async createEvent(
    name: string,
    description: string,
    date: string,
  ): Promise<Event> {
    const newDate = new Date(date);
    const newEvent = await this.eventsModel.create({
      name,
      description,
      date: newDate,
    });

    return this.eventsModel.findOne({
      where: { id: newEvent.id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'publication'] },
      include: [{ model: Category, attributes: { include: ['id', 'name'] } }],
    });
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
    date: string,
    publication: boolean,
    categoryNames: string[],
  ): Promise<Event> {
    const event = await this.eventsModel.findOne({
      where: { id: eventId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'publication'] },
      include: [{ model: Category, attributes: { include: ['id', 'name'] } }],
    });

    if (!event) throw new NotFoundException('event not found');

    if (name) event.name = name;
    if (date) event.date = new Date(date);
    if (description) event.description = description;
    if (publication != null && publication != undefined)
      event.publication = publication;
    if (categoryNames) {
      await this.eventCategoryModel.destroy({ where: { eventId } });

      const categories = await Promise.all(
        categoryNames.map(async (name) => {
          let category = await this.categoryModel.findOne({
            where: { name },
          });

          if (!category) {
            category = await this.categoryModel.create({ name });
          }

          return category;
        }),
      );

      for (const category of categories) {
        await this.eventCategoryModel.create({
          eventId,
          categoryId: category.id,
        });
      }
    }

    await event.save();

    return event;
  }

  async deleteEvent(eventId: number): Promise<string> {
    const event = await this.eventsModel.findByPk(eventId);

    if (!event) throw new NotFoundException('event not found');

    await event.destroy();

    return 'event deleted';
  }
}
