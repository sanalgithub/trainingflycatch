import { INestApplication, Injectable } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppProperties } from '@app/common/config/properties/application.properties';

@Injectable()
export class SwaggerConfig {
  constructor(private properties: AppProperties) {}
  setUp(app: INestApplication): void {
    SwaggerModule.setup(
      this.properties.server['swagger-ui'].path,
      app,
      undefined as unknown as OpenAPIObject,
      {
        useGlobalPrefix: true,
        swaggerOptions: {
          url: this.properties.server['swagger-ui'].schema,
        },
      },
    );
  }
}
