import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from './entities';
import { OrdersController } from './orders.controller';

@Module({
  imports:[
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'devpass',
      database: process.env.DB_NAME || 'minishop',
      entities:[Order, OrderItem], synchronize:true
    }),
    TypeOrmModule.forFeature([Order, OrderItem])
  ],
  controllers:[OrdersController]
})
export class AppModule {}
