import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() title!: string;
  @Column({ unique: true }) slug!: string;
  @Column({ default: '' }) description!: string;
  @Column({ type: 'int' }) price_cents!: number;
  @Column({ default: 'GBP' }) currency!: string;
  @Column({ type: 'text', nullable: true }) image!: string | null;
  @Column({ type: 'jsonb', nullable: true }) attributes!: any | null;
  @Column({ type: 'timestamptz', default: () => 'now()' }) created_at!: Date;
}
