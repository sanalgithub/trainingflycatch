import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConfigDatabase } from '../config/config.database';
import { User } from '../model/user';

@Injectable()
export class UserRepository {
  private repository: Repository<User>;
  constructor(private databaseConfig: ConfigDatabase) {
    this.repository = databaseConfig.source.getRepository(User);
  }
  save(user: User): Promise<User> {
    return this.repository.save(user);
  }
  findUserByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email });
  }
  saveUserByResetPassword(user: User): Promise<User> {
    return this.repository.save(user);
  }
}
