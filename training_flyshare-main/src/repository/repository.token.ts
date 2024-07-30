import { Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { User } from '../model/user';
import { ConfigDatabase } from '../config/config.database';
import { Token } from '../model/token';

@Injectable()
export class TokenRepository {
  private repository: Repository<Token>;
  constructor(private configdatabase: ConfigDatabase) {
    this.repository = configdatabase.source.getRepository(Token);
  }

  async save(token: Token): Promise<Token> {
    return this.repository.save(token);
  }

  async findTokenByCode(code: string): Promise<Token> {
    return this.repository.findOneBy({ code });
  }

  async findTokenByUserAndCode(user: User, code: string): Promise<Token> {
    return this.repository.findOneBy({ uservalue: user, code });
  }

  async deleteExpiredToken() {
    await this.configdatabase.source
      .createQueryBuilder()
      .delete()
      .from(Token)
      .where({
        expiretime: LessThan(new Date()),
      })
      .execute();
  }
}
