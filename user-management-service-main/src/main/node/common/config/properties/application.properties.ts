import { Injectable } from '@nestjs/common';
import { CorsOptions } from 'cors';
import Joi from 'joi';
import { readYamlEnvSync } from 'yaml-env-defaults';
import { constants } from '@app/common/config/constants';

@Injectable()
export class AppProperties {
  readonly db!: {
    user: string;
    password: string;
    url: string;
    name: string;
  };

  readonly server!: {
    base: string;
    port: number;
    cors: CorsOptions;
    static: {
      path: string;
    };
    'swagger-ui': {
      path: string;
      schema: string;
    };
  };

  readonly app!: {
    passwordHashRounds: number;
  };

  constructor() {
    const yaml = readYamlEnvSync(constants.CONFIG_PATH);
    const result = Joi.object<AppProperties, true>({
      db: Joi.object({
        name: Joi.string(),
        password: Joi.string(),
        url: Joi.string(),
        user: Joi.string(),
      }).required(),
      server: Joi.object({
        base: Joi.string(),
        port: Joi.number(),
        cors: Joi.object<AppProperties['server']['cors']>({
          origin: Joi.alternatives(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          allowedHeaders: Joi.alternatives(
            Joi.string(),
            Joi.array().items(Joi.string()),
          ),
          credentials: Joi.boolean().optional(),
          methods: Joi.array().items(Joi.string()),
        }),
        static: Joi.object({
          path: Joi.string(),
        }),
        'swagger-ui': Joi.object({
          path: Joi.string(),
          schema: Joi.string(),
        }),
      }).required(),

      app: Joi.object<AppProperties['app'], true>({
        passwordHashRounds: Joi.number().required(),
      }).required(),
    }).validate(yaml, {
      convert: true,
    });
    if (result.error || result.warning) {
      throw result.error ?? result.warning;
    }
    Object.assign(this, result.value);
  }
}
