import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ unique: true }) email!: string;
  @Column() password_hash!: string;
  @Column({ default: 'customer' }) role!: 'customer' | 'admin';
  @Column({ type: 'timestamptz', default: () => 'now()' }) created_at!: Date;
}
