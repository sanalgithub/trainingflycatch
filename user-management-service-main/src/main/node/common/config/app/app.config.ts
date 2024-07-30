import { INestApplication, Injectable, ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import helmet from 'helmet';
import { CustomLogger } from '@app/common/config/app/logger';
import { AppProperties } from '@app/common/config/properties/application.properties';
import { SwaggerConfig } from '@app/common/config/swagger/swagger.config';

@Injectable()
export class AppConfig {
  constructor(
    private properties: AppProperties,
    private swaggerConfig: SwaggerConfig,
  ) {}

  config(app: INestApplication): void {
    app.useLogger(new CustomLogger());
    app.use(cors(this.properties.server.cors));
    app.use(helmet());
    app.setGlobalPrefix(this.properties.server.base);
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    this.swaggerConfig.setUp(app);
  }
}
