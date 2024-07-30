import { Injectable } from '@nestjs/common';
import {
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  validateSync,
} from 'class-validator';

class DbConfig {
  @IsNotEmpty()
  readonly host: string = process.env.DB_HOST;

  @IsNotEmpty()
  readonly password: string = process.env.DB_PASSWORD;

  @IsNotEmpty()
  readonly user: string = process.env.DB_USER;

  @IsNotEmpty()
  readonly database: string = process.env.DB_DB;
}

class MailerConfig {
  @IsNotEmpty()
  readonly authemail: string = process.env.AUTH_EMAIL;

  @IsNotEmpty()
  readonly authpassword: string = process.env.AUTH_PASSWORD;
}

class JwtConfig {
  @IsNotEmpty()
  readonly token: string = process.env.JWT_TOKEN;

  @IsNotEmpty()
  readonly expiresin: string = process.env.JWT_TOKEN_EXPIRETIME;
}
@Injectable()
export class AppConfig {
  @IsNumber()
  readonly port: number = parseInt(process.env.PORT);

  @ValidateNested()
  readonly db: DbConfig = new DbConfig();

  @ValidateNested()
  readonly jwt: JwtConfig = new JwtConfig();

  @ValidateNested()
  readonly mailer: MailerConfig = new MailerConfig();

  constructor() {
    const errors = validateSync(this);
    if (errors.length !== 0) {
      throw new Error(errors.map((e) => e.toString()).join('\n'));
    }
  }
}
