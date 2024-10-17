import { Table, Model, Column, BelongsToMany } from 'sequelize-typescript';

import { Event, EventCategory } from './';

@Table({ tableName: 'categories', timestamps: true, underscored: true })
export default class Category extends Model<Category> {
  @Column({ allowNull: false, unique: true })
  name: string;

  @BelongsToMany(() => Event, () => EventCategory)
  events: Event[];
}
