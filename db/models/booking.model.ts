import {
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  Column,
} from 'sequelize-typescript';

import { User, Event } from './';

@Table({ tableName: 'bookings', timestamps: true, underscored: true })
export default class Booking extends Model<Booking> {
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Event)
  event: Event;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Event)
  @Column
  eventId: number;
}
