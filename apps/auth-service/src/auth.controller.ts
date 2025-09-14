import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Controller()
export class HealthController { @Get('health') health(){ return { ok: true }; } }

@Controller('auth')
export class AuthController {
  constructor(private users: UsersService){}
  @Post('register')
  async register(@Body() dto: { email:string; password:string }){
    const hash = await bcrypt.hash(dto.password, 12);
    const user = await this.users.create(dto.email, hash);
    return { id: user.id, email: user.email };
  }
  @Post('login')
  async login(@Body() dto: { email:string; password:string }){
    const user = await this.users.findByEmail(dto.email);
    if(!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.password_hash);
    if(!ok) throw new UnauthorizedException('Invalid credentials');
    const secret = process.env.JWT_SECRET || 'supersecret';
    const access = jwt.sign({ sub: user.id, email: user.email, role: user.role }, secret, { algorithm:'HS256', expiresIn:'1h' });
    return { access };
  }
}
