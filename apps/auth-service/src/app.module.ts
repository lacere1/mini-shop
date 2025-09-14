import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthController, HealthController } from './auth.controller';
import * as bcrypt from 'bcryptjs';

@Module({
  imports:[
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'devpass',
      database: process.env.DB_NAME || 'minishop',
      entities:[User], synchronize:true
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers:[AuthController, HealthController],
  providers:[UsersService]
})
export class AppModule implements OnModuleInit {
  constructor(private users: UsersService){}
  async onModuleInit(){
    const email = process.env.ADMIN_EMAIL || 'admin@minishop.local';
    const pass = process.env.ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(pass, 12);
    await this.users.ensureAdmin(email, hash);
  }
}
