import { Table, Model, Column, HasMany } from 'sequelize-typescript';

import { Roles } from '../../src/types/users.types';
import { Booking } from './';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export default class User extends Model<User> {
  @Column({ allowNull: false, unique: true })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ defaultValue: Roles.user })
  role: Roles;

  @Column({ defaultValue: false })
  isConfirmed: boolean;

  @HasMany(() => Booking)
  bookings: Booking[];
}
