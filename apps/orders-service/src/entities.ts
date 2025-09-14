import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column() user_id!: string;
  @Column({ type: 'int' }) total_cents!: number;
  @Column({ default: 'GBP' }) currency!: string;
  @Column({ default: 'created' }) status!: 'created' | 'paid' | 'cancelled';
  @Column({ type: 'timestamptz', default: () => 'now()' }) created_at!: Date;
  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true }) items!: OrderItem[];
}
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @ManyToOne(() => Order, (o) => o.items) order!: Order;
  @Column() product_id!: string;
  @Column() title!: string;
  @Column({ type: 'int' }) price_cents!: number;
  @Column({ type: 'int' }) qty!: number;
}
