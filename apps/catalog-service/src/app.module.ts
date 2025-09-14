import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CatalogController } from './catalog.controller';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'devpass',
      database: process.env.DB_NAME || 'minishop',
      entities:[Product], synchronize:true
    }),
    TypeOrmModule.forFeature([Product])
  ],
  controllers:[CatalogController]
})
export class AppModule implements OnModuleInit {
  constructor(@InjectRepository(Product) private repo: Repository<Product>){}
  async onModuleInit(){
    if(await this.repo.count()===0){
      await this.repo.save([
        { title:'T-Shirt', slug:'t-shirt', description:'Soft cotton tee', price_cents:1999, currency:'GBP', image:'/images/tshirt.jpg' },
        { title:'Trainers', slug:'trainers', description:'Lightweight everyday trainers', price_cents:6999, currency:'GBP', image:'/images/trainers.jpg' },
        { title:'Hoodie', slug:'hoodie', description:'Cozy fleece hoodie', price_cents:3999, currency:'GBP', image:'/images/hoodie.jpg' },
        { title:'Cap', slug:'cap', description:'Classic baseball cap', price_cents:1499, currency:'GBP', image:'/images/cap.jpg' },
        { title:'Backpack', slug:'backpack', description:'Daily backpack', price_cents:4999, currency:'GBP', image:'/images/backpack.jpg' },
        { title:'Socks (3 pack)', slug:'socks-3pk', description:'Comfort socks', price_cents:999, currency:'GBP', image:'/images/socks.jpg' }
      ] as any);
    }
  }
}
