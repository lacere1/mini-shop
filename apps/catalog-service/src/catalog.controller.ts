import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { verifyAuth } from './jwt';

@Controller('products')
export class CatalogController {
  constructor(@InjectRepository(Product) private repo: Repository<Product>){}
  @Get() list(){ return this.repo.find({ order: { created_at: 'DESC' } }); }
  @Get(':id') get(@Param('id') id: string){ return this.repo.findOne({ where: { id } }); }

  @Post()
  async create(@Req() req:any, @Body() body: Partial<Product>){
    const u = verifyAuth(req.headers.authorization);
    if(!u || u.role!=='admin') return { error:'Forbidden' };
    const p = this.repo.create(body as any);
    return this.repo.save(p);
  }
  @Put(':id')
  async update(@Req() req:any, @Param('id') id:string, @Body() body: Partial<Product>){
    const u = verifyAuth(req.headers.authorization);
    if(!u || u.role!=='admin') return { error:'Forbidden' };
    await this.repo.update({ id }, body); return this.repo.findOne({ where: { id } });
  }
  @Delete(':id')
  async remove(@Req() req:any, @Param('id') id:string){
    const u = verifyAuth(req.headers.authorization);
    if(!u || u.role!=='admin') return { error:'Forbidden' };
    await this.repo.delete({ id }); return { ok: true };
  }
}
