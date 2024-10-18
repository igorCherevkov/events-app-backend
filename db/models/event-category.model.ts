import { Table, Model, ForeignKey, Column } from 'sequelize-typescript';

import { Event, Category } from './';

@Table({ tableName: 'events_categories', timestamps: true, underscored: true })
export default class EventCategory extends Model<EventCategory> {
  @ForeignKey(() => Event)
  @Column
  eventId: number;

  @ForeignKey(() => Category)
  @Column
  categoryId: number;
}
