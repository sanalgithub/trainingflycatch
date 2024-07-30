import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { AppProperties } from '@app/common/config';

@Injectable()
export class PasswordEncoder {
  constructor(private properties: AppProperties) {}

  async encode(password: string): Promise<string> {
    return hash(password, this.properties.app.passwordHashRounds);
  }

  async matches(hash: string, raw: string): Promise<boolean> {
    return compare(raw, hash);
  }
}
