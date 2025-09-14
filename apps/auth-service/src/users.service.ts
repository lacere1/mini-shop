import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>){}
  create(email: string, password_hash: string){ const u = this.repo.create({ email, password_hash }); return this.repo.save(u); }
  findByEmail(email: string){ return this.repo.findOne({ where: { email } }); }
  async ensureAdmin(email: string, hash: string){
    let u = await this.findByEmail(email);
    if(!u){ u = this.repo.create({ email, password_hash: hash, role:'admin' }); return this.repo.save(u); }
    if(u.role!=='admin'){ u.role='admin'; return this.repo.save(u); }
    return u;
  }
}
