import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { AppProperties } from '@app/common/config';

@Injectable()
export class DatabaseConfig implements MongooseOptionsFactory {
  constructor(private config: AppProperties) {}

  createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    return {
      uri: this.config.db.url,
      auth: {
        username: this.config.db.user,
        password: this.config.db.password,
      },
      dbName: this.config.db.name,
    };
  }
}
