import {
  Table,
  Model,
  Column,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';

import Booking from './booking.model';
import Category from './category.model';
import EventCategory from './event-category.model';

@Table({ tableName: 'events', timestamps: true, underscored: true })
export default class Event extends Model<Event> {
  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ defaultValue: true })
  publication: boolean;

  @Column({ allowNull: false })
  date: Date;

  @HasMany(() => Booking)
  bookings: Booking[];

  @BelongsToMany(() => Category, () => EventCategory)
  categories: Category[];
}
