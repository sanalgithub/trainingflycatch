import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppConfig } from '@app/common/config/app/app.config';
import { AppProperties } from '@app/common/config/properties/application.properties';
import { SwaggerConfig } from '@app/common/config/swagger/swagger.config';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      inject: [AppProperties],
      useFactory: (properties: AppProperties) => {
        return [
          {
            rootPath: join(__dirname, '../../../resources/static'),
            serveRoot: properties.server.static.path,
          },
        ];
      },
    }),
  ],
  providers: [AppProperties, SwaggerConfig, AppConfig],
  exports: [AppProperties],
})
export class ConfigModule {}
