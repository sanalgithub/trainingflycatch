import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { AppConfig } from './app.config';

dotenv.config();

@Injectable()
export class ConfigDatabase implements OnModuleInit {
  readonly source: DataSource;

  constructor(private config: AppConfig) {
    this.source = new DataSource({
      type: 'mysql',
      host: config.db.host,
      password: config.db.password,
      username: config.db.user,
      database: config.db.database,
      synchronize: true,
      port: 3306,
      entities: [`${__dirname}/../model/*{.ts,.js}`],
      subscribers: [],
      migrations: [],
      logging: 'all',
    });
  }

  async onModuleInit() {
    this.source.initialize();
  }
}
