import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem } from './entities';
import { requireUser } from './jwt';
import PDFDocument = require('pdfkit');

@Controller('orders')
export class OrdersController {
  constructor(@InjectRepository(Order) private orders: Repository<Order>, @InjectRepository(OrderItem) private items: Repository<OrderItem>){}

  @Post()
  async create(
    @Req() req: any,
    @Body() body: { items: any[]; total_cents: number }
  ) {
    const u = requireUser(req.headers.authorization);

    if (!body?.items?.length || !Number.isFinite(body.total_cents)) {
      return { error: 'Bad request' };
    }

    const items = body.items.map((i: any) => {
      const pid = i.product_id ?? i.id; 
      return Object.assign(new OrderItem(), {
        product_id: pid,
        title: i.title,
        price_cents: i.price_cents,
        qty: i.qty,
      });
    });

    const order = this.orders.create({
      user_id: u.sub,
      total_cents: body.total_cents,
      currency: 'GBP',
      status: 'created',
      items,
    });

    return this.orders.save(order);
  }

  @Get('my')
  async my(@Req() req:any){
    const u = requireUser(req.headers.authorization);
    return this.orders.find({ where:{ user_id: u.sub }, order:{ created_at:'DESC' }, relations:['items'] });
  }

}
