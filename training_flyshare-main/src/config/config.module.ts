import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AppConfig } from './app.config';
import { MailConfig } from './config.mail';
import { ConfigDatabase } from './config.database';

@Module({
  imports: [JwtModule.register({})],
  providers: [ConfigDatabase, AppConfig, MailConfig, JwtService],
  exports: [ConfigDatabase, AppConfig, MailConfig, JwtService],
})
export class ConfigModule {}
